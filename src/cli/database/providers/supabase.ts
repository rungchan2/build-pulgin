import type { AnalysisResult, CodeIndexItem } from '../../../core/types';
import type { DatabaseProvider } from '../provider';
import type { SupabaseConfig, UploadResult } from '../types';

/**
 * Supabase 프로바이더
 *
 * 테이블 구조:
 * - code_index: 개별 코드 파일 메타데이터 (각 파일이 하나의 row)
 * - code_analysis_log: 분석 실행 로그
 */
export class SupabaseProvider implements DatabaseProvider {
  name = 'Supabase';
  private config: SupabaseConfig;

  constructor(config: SupabaseConfig) {
    this.config = config;
  }

  /**
   * Supabase REST API URL 생성
   */
  private getRestUrl(table: string): string {
    const baseUrl = this.config.url.replace(/\/$/, '');
    return `${baseUrl}/rest/v1/${table}`;
  }

  /**
   * 공통 헤더
   */
  private getHeaders(): Record<string, string> {
    return {
      'apikey': this.config.serviceRoleKey,
      'Authorization': `Bearer ${this.config.serviceRoleKey}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * 연결 테스트
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.getRestUrl(this.config.tableName), {
        method: 'GET',
        headers: {
          ...this.getHeaders(),
          'Range': '0-0',
        },
      });

      return response.ok || response.status === 416;
    } catch {
      return false;
    }
  }

  /**
   * 메타데이터 업로드
   *
   * 1. 기존 프로젝트 데이터 삭제
   * 2. 새 데이터 bulk insert
   * 3. 분석 로그 기록
   */
  async upload(result: AnalysisResult): Promise<UploadResult> {
    const { tableName, projectUuid } = this.config;

    try {
      // 1. 기존 프로젝트 데이터 삭제
      await this.deleteByProjectId();

      // 2. 개별 파일 데이터 bulk insert
      if (result.items.length > 0) {
        const insertResult = await this.bulkInsertItems(result.items);
        if (!insertResult.success) {
          return insertResult;
        }
      }

      // 3. 분석 로그 기록
      await this.logAnalysis(result);

      return {
        success: true,
        message: `${result.items.length} files uploaded to ${tableName}`,
        data: {
          itemsCount: result.items.length,
          stats: result.stats,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to upload metadata',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * 프로젝트 UUID로 기존 데이터 삭제
   */
  private async deleteByProjectId(): Promise<void> {
    const { tableName, projectUuid, fields } = this.config;
    const projectIdColumn = fields.projectId || 'project_id';

    const response = await fetch(
      `${this.getRestUrl(tableName)}?${projectIdColumn}=eq.${encodeURIComponent(projectUuid)}`,
      {
        method: 'DELETE',
        headers: this.getHeaders(),
      }
    );

    if (!response.ok && response.status !== 404) {
      const errorText = await response.text();
      throw new Error(`Failed to delete existing data: ${errorText}`);
    }
  }

  /**
   * 개별 파일 데이터 bulk insert
   */
  private async bulkInsertItems(items: CodeIndexItem[]): Promise<UploadResult> {
    const { tableName, projectUuid, fields } = this.config;
    const projectIdColumn = fields.projectId || 'project_id';

    // CodeIndexItem을 테이블 row 형식으로 변환
    // project_id는 config의 projectUuid 사용 (UUID 타입)
    const rows = items.map(item => ({
      [projectIdColumn]: projectUuid,
      file_type: item.type,
      name: item.name,
      path: item.path,
      keywords: item.keywords,
      search_text: item.searchText,
      calls: item.calls,
      called_by: item.calledBy,
      metadata: item.metadata,
    }));

    // Supabase는 한 번에 많은 row를 insert할 수 있음
    // 하지만 너무 많으면 청크로 나눠서 처리
    const CHUNK_SIZE = 500;
    const chunks = this.chunkArray(rows, CHUNK_SIZE);

    for (const chunk of chunks) {
      const response = await fetch(this.getRestUrl(tableName), {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(chunk),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          message: `Failed to insert items`,
          error: errorText,
        };
      }
    }

    return { success: true, message: 'Items inserted successfully' };
  }

  /**
   * 분석 로그 기록
   */
  private async logAnalysis(result: AnalysisResult): Promise<void> {
    const { projectUuid, fields } = this.config;
    const logTableName = 'code_analysis_log';
    const projectIdColumn = fields.projectId || 'project_id';

    const logEntry = {
      [projectIdColumn]: projectUuid,
      total_files: result.stats.totalFiles,
      stats: result.stats.byType,
      parse_errors: result.stats.parseErrors,
      analyzed_at: result.timestamp,
    };

    try {
      await fetch(this.getRestUrl(logTableName), {
        method: 'POST',
        headers: {
          ...this.getHeaders(),
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(logEntry),
      });
    } catch {
      // 로그 기록 실패는 무시 (메인 데이터는 이미 저장됨)
    }
  }

  /**
   * 배열을 청크로 나누기
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
