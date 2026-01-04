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
}

/**
 * Vite 메타데이터 플러그인
 */
export function metadataPlugin(options: VitePluginOptions = {}): Plugin {
  const config = createDefaultConfig(options);
  const runOn = options.runOn || 'build';

  let viteConfig: ResolvedConfig;
  let analysisResult: AnalysisResult | null = null;

  const analyzer = new ProjectAnalyzer(config);
  const fileWriter = new FileWriter(config);
  const apiSender = config.output.api?.enabled ? new ApiSender(config) : null;

  return {
    name: 'vite-metadata-plugin',

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
      const shouldRun =
        runOn === 'both' ||
        (runOn === 'build' && viteConfig.command === 'build') ||
        (runOn === 'serve' && viteConfig.command === 'serve');

      if (!shouldRun) return;

      const rootDir = viteConfig.root;

      if (config.verbose) {
        console.log('[metadata-plugin] Starting analysis...');
      }

      try {
        analysisResult = await analyzer.analyze(rootDir);

        // 파일 출력
        if (config.output.file?.enabled) {
          const outputPath = path.resolve(rootDir, config.output.file.path);
          await fileWriter.write(analysisResult, outputPath);

          if (config.verbose) {
            console.log(`[metadata-plugin] Wrote metadata to ${outputPath}`);
          }
        }

        // API 전송
        if (apiSender) {
          await apiSender.send(analysisResult);

          if (config.verbose) {
            console.log('[metadata-plugin] Sent metadata to API');
          }
        }
      } catch (error) {
        console.error('[metadata-plugin] Analysis failed:', error);
        if (viteConfig.command === 'build') {
          throw error;
        }
      }
    },

    generateBundle() {
      if (!analysisResult) return;

      // 빌드 결과에 통계 정보 추가
      this.emitFile({
        type: 'asset',
        fileName: 'metadata-stats.json',
        source: JSON.stringify(analysisResult.stats, null, 2),
      });
    },
  };
}
