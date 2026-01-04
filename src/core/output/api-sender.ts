import type { AnalysisResult, PluginConfig } from '../types';

interface ApiSenderOptions {
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * 분석 결과를 API로 전송하는 클래스
 */
export class ApiSender {
  protected config: PluginConfig;
  private maxRetries: number;
  private retryDelay: number;

  constructor(config: PluginConfig, options: ApiSenderOptions = {}) {
    this.config = config;
    this.maxRetries = options.maxRetries ?? 3;
    this.retryDelay = options.retryDelay ?? 1000;
  }

  /**
   * 분석 결과를 API로 전송
   */
  async send(result: AnalysisResult): Promise<void> {
    const apiConfig = this.config.output.api;
    if (!apiConfig?.enabled || !apiConfig.endpoint) {
      return;
    }

    const payload = {
      projectId: this.config.projectId,
      timestamp: result.timestamp,
      items: result.items,
      stats: result.stats,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        await this.sendRequest(
          apiConfig.endpoint,
          payload,
          apiConfig.headers
        );
        return;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (this.config.verbose) {
          console.warn(
            `[metadata-plugin] API send attempt ${attempt + 1} failed:`,
            lastError.message
          );
        }

        // 마지막 시도가 아니면 대기 후 재시도
        if (attempt < this.maxRetries - 1) {
          await this.delay(this.retryDelay * (attempt + 1));
        }
      }
    }

    throw new Error(
      `Failed to send metadata after ${this.maxRetries} attempts: ${lastError?.message}`
    );
  }

  /**
   * HTTP POST 요청
   */
  private async sendRequest(
    endpoint: string,
    payload: unknown,
    headers?: Record<string, string>
  ): Promise<void> {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }
  }

  /**
   * 지연 함수
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Supabase 특화 API Sender
 */
export class SupabaseApiSender extends ApiSender {
  /**
   * Supabase upsert 형식으로 전송
   */
  async send(result: AnalysisResult): Promise<void> {
    const apiConfig = this.config.output.api;
    if (!apiConfig?.enabled || !apiConfig.endpoint) {
      return;
    }

    // Supabase upsert를 위한 데이터 변환
    const records = result.items.map((item) => ({
      id: item.id,
      project_id: item.projectId,
      type: item.type,
      name: item.name,
      path: item.path,
      keywords: item.keywords,
      search_text: item.searchText,
      calls: item.calls,
      called_by: item.calledBy,
      metadata: item.metadata,
      updated_at: result.timestamp,
    }));

    // 배치로 전송 (Supabase는 1000개 제한)
    const batchSize = 500;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);

      const response = await fetch(apiConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
          ...apiConfig.headers,
        },
        body: JSON.stringify(batch),
      });

      if (!response.ok) {
        throw new Error(`Supabase upsert failed: ${response.status}`);
      }
    }
  }
}
