import type { Plugin, ResolvedConfig } from 'vite';
import * as path from 'path';
import type { PluginConfig, AnalysisResult } from '../core/types';
import { ProjectAnalyzer } from '../core/analyzer';
import { createDefaultConfig, validateConfig } from '../core/config';
import { FileWriter } from '../core/output/file-writer';
import { ApiSender } from '../core/output/api-sender';

export interface VitePluginOptions extends Partial<PluginConfig> {
  /**
   * 분석 실행 시점
   * - 'build': 프로덕션 빌드 시에만 (기본값)
   * - 'serve': 개발 서버 시작 시에만
   * - 'both': 둘 다
   */
  runOn?: 'build' | 'serve' | 'both';

  /**
   * 빌드 결과에 통계 파일 포함 여부
   * 기본값: true
   */
  emitStatsFile?: boolean;
}

/**
 * 메타데이터 분석 실행 함수 (재사용)
 */
async function runMetadataAnalysis(
  pluginConfig: PluginConfig,
  rootDir: string
): Promise<AnalysisResult> {
  const analyzer = new ProjectAnalyzer(pluginConfig);
  const fileWriter = new FileWriter(pluginConfig);
  const apiSender = pluginConfig.output.api?.enabled
    ? new ApiSender(pluginConfig)
    : null;

  if (pluginConfig.verbose) {
    console.log('[metadata-plugin] Starting analysis...');
  }

  const result = await analyzer.analyze(rootDir);

  // 파일 출력
  if (pluginConfig.output.file?.enabled) {
    const outputPath = path.resolve(rootDir, pluginConfig.output.file.path);
    await fileWriter.write(result, outputPath);

    if (pluginConfig.verbose) {
      console.log(`[metadata-plugin] Wrote metadata to ${outputPath}`);
    }
  }

  // API 전송
  if (apiSender) {
    await apiSender.send(result);

    if (pluginConfig.verbose) {
      console.log('[metadata-plugin] Sent metadata to API');
    }
  }

  return result;
}

/**
 * Vite 메타데이터 플러그인
 *
 * Vite 4/5/6/7 호환
 * - 표준 Rollup 훅 사용 (configResolved, buildStart, closeBundle)
 * - Vite 7+ Environment API 대비 (client 환경에서만 실행)
 */
export function metadataPlugin(options: VitePluginOptions = {}): Plugin {
  const config = createDefaultConfig(options);
  const runOn = options.runOn || 'build';
  const emitStatsFile = options.emitStatsFile !== false;

  let viteConfig: ResolvedConfig;
  let analysisResult: AnalysisResult | null = null;
  let hasRun = false;

  return {
    name: 'vite-metadata-plugin',

    // 플러그인 실행 순서: pre(빠른 실행), post(늦은 실행)
    // 메타데이터 분석은 다른 플러그인에 영향 없으므로 post로 설정
    enforce: 'post',

    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig;

      // 설정 검증
      const errors = validateConfig(config);
      if (errors.length > 0) {
        throw new Error(
          `[metadata-plugin] Invalid config:\n${errors.join('\n')}`
        );
      }
    },

    async buildStart() {
      // Vite 7+ Environment API 대비: 중복 실행 방지
      // Vite 7에서는 여러 환경(client, ssr, edge 등)에서 buildStart가 호출될 수 있음
      if (hasRun) return;

      const shouldRun =
        runOn === 'both' ||
        (runOn === 'build' && viteConfig.command === 'build') ||
        (runOn === 'serve' && viteConfig.command === 'serve');

      if (!shouldRun) return;

      hasRun = true;
      const rootDir = viteConfig.root;

      try {
        analysisResult = await runMetadataAnalysis(config, rootDir);
      } catch (error) {
        console.error('[metadata-plugin] Analysis failed:', error);
        if (viteConfig.command === 'build') {
          throw error;
        }
      }
    },

    generateBundle() {
      if (!analysisResult || !emitStatsFile) return;

      // 빌드 결과에 통계 정보 추가
      this.emitFile({
        type: 'asset',
        fileName: 'metadata-stats.json',
        source: JSON.stringify(analysisResult.stats, null, 2),
      });
    },

    // Vite 7+ 호환: closeBundle은 모든 환경 빌드 완료 후 한 번만 호출됨
    closeBundle() {
      if (config.verbose && analysisResult) {
        console.log(
          `[metadata-plugin] Build complete. Analyzed ${analysisResult.stats.totalFiles} files.`
        );
      }
      // 다음 빌드를 위해 상태 초기화
      hasRun = false;
      analysisResult = null;
    },
  };
}
