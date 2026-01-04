import * as fs from 'fs/promises';
import * as path from 'path';
import type { AnalysisResult, PluginConfig } from '../types';

/**
 * 분석 결과를 JSON 파일로 출력하는 클래스
 */
export class FileWriter {
  private config: PluginConfig;

  constructor(config: PluginConfig) {
    this.config = config;
  }

  /**
   * 분석 결과를 파일로 저장
   */
  async write(result: AnalysisResult, outputPath: string): Promise<void> {
    // 출력 디렉토리 생성
    const dir = path.dirname(outputPath);
    await fs.mkdir(dir, { recursive: true });

    // JSON 파일 작성
    const output = this.formatOutput(result);
    await fs.writeFile(outputPath, output, 'utf-8');
  }

  /**
   * 출력 형식 생성
   */
  private formatOutput(result: AnalysisResult): string {
    const output = {
      version: '1.0.0',
      projectId: this.config.projectId,
      generatedAt: result.timestamp,
      stats: result.stats,
      items: result.items,
    };

    // 프로덕션에서는 minify, 개발에서는 pretty print
    if (this.config.mode === 'production') {
      return JSON.stringify(output);
    }

    return JSON.stringify(output, null, 2);
  }
}
