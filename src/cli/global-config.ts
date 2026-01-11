import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/**
 * 글로벌 설정 디렉토리 (~/.metadatafy/)
 */
const CONFIG_DIR = path.join(os.homedir(), '.metadatafy');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const AUTH_FILE = path.join(CONFIG_DIR, 'auth.json');

/**
 * 데이터베이스 프로바이더 타입
 */
export type DatabaseProvider = 'supabase' | 'custom';

/**
 * 글로벌 설정 구조
 */
export interface GlobalConfig {
  database?: {
    provider: DatabaseProvider;
    // Supabase
    supabaseUrl?: string;
    supabaseServiceRoleKey?: string;
    supabaseTable?: string;
    // Custom API
    apiEndpoint?: string;
    apiMethod?: 'POST' | 'PUT' | 'PATCH';
    apiHeaders?: Record<string, string>;
  };
  api?: {
    serverUrl?: string; // ticket-ms 같은 중앙 서버
  };
}

/**
 * 인증 정보 구조
 */
export interface AuthInfo {
  accessToken: string;
  expiresAt: string;
  userId?: string;
  serverUrl?: string; // 어떤 서버에 로그인했는지
}

/**
 * 설정 디렉토리 확인/생성
 */
function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { mode: 0o700 }); // 소유자만 접근
  }
}

/**
 * 글로벌 설정 로드
 */
export function loadGlobalConfig(): GlobalConfig {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      return {};
    }
    const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(content) as GlobalConfig;
  } catch {
    return {};
  }
}

/**
 * 글로벌 설정 저장
 */
export function saveGlobalConfig(config: GlobalConfig): void {
  ensureConfigDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), {
    mode: 0o600, // 소유자만 읽기/쓰기
  });
}

/**
 * 글로벌 설정 값 설정
 */
export function setConfigValue(key: string, value: string): void {
  const config = loadGlobalConfig();

  // 점 표기법 지원 (database.supabaseUrl)
  const keys = key.split('.');
  let current: Record<string, unknown> = config as Record<string, unknown>;

  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (!current[k] || typeof current[k] !== 'object') {
      current[k] = {};
    }
    current = current[k] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
  saveGlobalConfig(config);
}

/**
 * 글로벌 설정 값 가져오기
 */
export function getConfigValue(key: string): unknown {
  const config = loadGlobalConfig();
  const keys = key.split('.');
  let current: unknown = config;

  for (const k of keys) {
    if (current && typeof current === 'object' && k in current) {
      current = (current as Record<string, unknown>)[k];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * 인증 정보 로드
 */
export function loadAuthInfo(): AuthInfo | null {
  try {
    if (!fs.existsSync(AUTH_FILE)) {
      return null;
    }
    const content = fs.readFileSync(AUTH_FILE, 'utf-8');
    const auth = JSON.parse(content) as AuthInfo;

    // 만료 확인
    if (auth.expiresAt && new Date(auth.expiresAt) < new Date()) {
      console.log('⚠️  인증이 만료되었습니다. 다시 로그인하세요.');
      return null;
    }

    return auth;
  } catch {
    return null;
  }
}

/**
 * 인증 정보 저장
 */
export function saveAuthInfo(auth: AuthInfo): void {
  ensureConfigDir();
  fs.writeFileSync(AUTH_FILE, JSON.stringify(auth, null, 2), {
    mode: 0o600,
  });
}

/**
 * 인증 정보 삭제
 */
export function clearAuthInfo(): void {
  if (fs.existsSync(AUTH_FILE)) {
    fs.unlinkSync(AUTH_FILE);
  }
}

/**
 * 로그인 상태 확인
 */
export function isLoggedIn(): boolean {
  const auth = loadAuthInfo();
  return auth !== null && !!auth.accessToken;
}

/**
 * Access Token 가져오기
 */
export function getAccessToken(): string | null {
  const auth = loadAuthInfo();
  return auth?.accessToken || null;
}

/**
 * 설정 경로 가져오기
 */
export function getConfigDir(): string {
  return CONFIG_DIR;
}

/**
 * 데이터베이스 설정 가져오기
 */
export function getDatabaseConfig(): GlobalConfig['database'] | null {
  const config = loadGlobalConfig();
  if (!config.database?.provider) {
    return null;
  }
  return config.database;
}

/**
 * API 서버 URL 가져오기
 */
export function getApiServerUrl(): string {
  const config = loadGlobalConfig();
  return config.api?.serverUrl || 'https://management.impakers.club';
}

/**
 * 설정 초기화
 */
export function clearAllConfig(): void {
  if (fs.existsSync(CONFIG_FILE)) {
    fs.unlinkSync(CONFIG_FILE);
  }
  if (fs.existsSync(AUTH_FILE)) {
    fs.unlinkSync(AUTH_FILE);
  }
}
