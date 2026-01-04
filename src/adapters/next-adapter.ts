import type { NextConfig } from 'next';
import type { Compiler, WebpackPluginInstance } from 'webpack';
import * as path from 'path';
import type { PluginConfig } from '../core/types';
import { ProjectAnalyzer } from '../core/analyzer';
import { createDefaultConfig, validateConfig } from '../core/config';
import { FileWriter } from '../core/output/file-writer';
import { ApiSender } from '../core/output/api-sender';

export interface NextPluginOptions extends Partial<PluginConfig> {
  /**
   * 분석 실행 시점
   * - 'build': 프로덕션 빌드 시에만 (기본값)
   * - 'dev': 개발 모드 시에만
   * - 'both': 둘 다
   */
  runOn?: 'build' | 'dev' | 'both';
}

/**
 * Next.js 설정을 확장하는 함수
 */
export function withMetadata(
  options: NextPluginOptions = {}
): (nextConfig: NextConfig) => NextConfig {
  const pluginConfig = createDefaultConfig(options);
  const runOn = options.runOn || 'build';

  // 설정 검증
  const errors = validateConfig(pluginConfig);
  if (errors.length > 0) {
    throw new Error(
      `[metadata-plugin] Invalid config:\n${errors.join('\n')}`
    );
  }

  return (nextConfig: NextConfig): NextConfig => {
    return {
      ...nextConfig,

      webpack(config, context) {
        const { dev, isServer } = context;

        // 서버 사이드에서만 실행 (클라이언트 빌드에서 중복 실행 방지)
        if (!isServer) {
          return typeof nextConfig.webpack === 'function'
            ? nextConfig.webpack(config, context)
            : config;
        }

        const shouldRun =
          runOn === 'both' ||
          (runOn === 'build' && !dev) ||
          (runOn === 'dev' && dev);

        if (shouldRun) {
          config.plugins = config.plugins || [];
          config.plugins.push(new MetadataWebpackPlugin(pluginConfig));
        }

        // 기존 webpack 설정 체이닝
        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, context);
        }

        return config;
      },
    };
  };
}

/**
 * Webpack 플러그인 클래스
 */
class MetadataWebpackPlugin implements WebpackPluginInstance {
  private config: PluginConfig;
  private hasRun: boolean = false;

  constructor(config: PluginConfig) {
    this.config = config;
  }

  apply(compiler: Compiler): void {
    const pluginName = 'MetadataWebpackPlugin';

    // 컴파일 시작 시 분석 실행
    compiler.hooks.beforeCompile.tapAsync(
      pluginName,
      async (_params, callback) => {
        // 중복 실행 방지
        if (this.hasRun) {
          return callback();
        }
        this.hasRun = true;

        try {
          await this.runAnalysis(compiler.context);
          callback();
        } catch (error) {
          callback(error as Error);
        }
      }
    );

    // 개발 모드에서 watch 재빌드 시 플래그 리셋
    compiler.hooks.watchRun.tap(pluginName, () => {
      // 필요시 재분석 로직 추가
    });
  }

  private async runAnalysis(rootDir: string): Promise<void> {
    const analyzer = new ProjectAnalyzer(this.config);
    const fileWriter = new FileWriter(this.config);
    const apiSender = this.config.output.api?.enabled
      ? new ApiSender(this.config)
      : null;

    if (this.config.verbose) {
      console.log('[metadata-plugin] Starting analysis...');
    }

    const result = await analyzer.analyze(rootDir);

    // 파일 출력
    if (this.config.output.file?.enabled) {
      const outputPath = path.resolve(rootDir, this.config.output.file.path);
      await fileWriter.write(result, outputPath);

      if (this.config.verbose) {
        console.log(`[metadata-plugin] Wrote metadata to ${outputPath}`);
      }
    }

    // API 전송
    if (apiSender) {
      await apiSender.send(result);

      if (this.config.verbose) {
        console.log('[metadata-plugin] Sent metadata to API');
      }
    }
  }
}
