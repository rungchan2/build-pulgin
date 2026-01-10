/**
 * 데이터베이스 프로바이더 타입
 */
export type DatabaseProvider = 'supabase' | 'firebase' | 'planetscale' | 'custom';

/**
 * 데이터베이스 설정 기본 인터페이스
 */
export interface DatabaseConfig {
  provider: DatabaseProvider;
  enabled: boolean;
}

/**
 * Supabase 설정
 */
export interface SupabaseConfig extends DatabaseConfig {
  provider: 'supabase';
  url: string;
  serviceRoleKey: string;
  tableName: string;
  /**
   * 프로젝트 UUID (code_index.project_id에 저장될 값)
   * projects 테이블의 UUID를 사용
   */
  projectUuid: string;
  fields: SupabaseFieldMapping;
}

/**
 * Supabase 필드 매핑
 */
export interface SupabaseFieldMapping {
  /** 프로젝트 ID 컬럼명 (기본값: project_id) */
  projectId: string;
  /** 메타데이터 JSON 컬럼명 (기본값: metadata) */
  metadata: string;
  /** 생성 시간 컬럼명 (선택) */
  createdAt?: string;
  /** 업데이트 시간 컬럼명 (선택) */
  updatedAt?: string;
}

/**
 * 커스텀 API 설정
 */
export interface CustomApiConfig extends DatabaseConfig {
  provider: 'custom';
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH';
  headers?: Record<string, string>;
}

/**
 * 모든 데이터베이스 설정 타입
 */
export type AnyDatabaseConfig = SupabaseConfig | CustomApiConfig;

/**
 * 데이터베이스 설정 파일 구조
 */
export interface DatabaseConfigFile {
  database: AnyDatabaseConfig;
}

/**
 * 업로드 결과
 */
export interface UploadResult {
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
}
