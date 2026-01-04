import type { PluginConfig, FileType } from './types';

/**
 * 기본 파일 타입 매핑 (glob 패턴 -> FileType)
 */
export const DEFAULT_FILE_TYPE_MAPPING: Record<string, FileType> = {
  // Next.js App Router
  'app/**/page.tsx': 'route',
  'app/**/page.ts': 'route',
  'app/**/layout.tsx': 'route',
  'app/**/layout.ts': 'route',
  'app/**/route.tsx': 'api',
  'app/**/route.ts': 'api',
  'app/api/**/*.ts': 'api',
  'app/api/**/*.tsx': 'api',

  // Pages Router (레거시)
  'pages/**/*.tsx': 'route',
  'pages/**/*.ts': 'route',
  'pages/api/**/*.ts': 'api',

  // Components
  'components/**/*.tsx': 'component',
  'components/**/*.ts': 'component',
  'src/components/**/*.tsx': 'component',
  'src/components/**/*.ts': 'component',

  // Hooks
  'hooks/**/*.ts': 'hook',
  'hooks/**/*.tsx': 'hook',
  'src/hooks/**/*.ts': 'hook',
  'src/hooks/**/*.tsx': 'hook',

  // Services
  'services/**/*.ts': 'service',
  'src/services/**/*.ts': 'service',

  // Utilities
  'lib/**/*.ts': 'utility',
  'src/lib/**/*.ts': 'utility',
  'utils/**/*.ts': 'utility',
  'src/utils/**/*.ts': 'utility',

  // Database
  'supabase/migrations/*.sql': 'table',
  'prisma/migrations/**/*.sql': 'table',
};

/**
 * 기본 포함 패턴
 */
export const DEFAULT_INCLUDE_PATTERNS = [
  'app/**/*.{ts,tsx}',
  'pages/**/*.{ts,tsx}',
  'components/**/*.{ts,tsx}',
  'hooks/**/*.{ts,tsx}',
  'services/**/*.ts',
  'lib/**/*.ts',
  'utils/**/*.ts',
  'src/**/*.{ts,tsx}',
  'supabase/migrations/*.sql',
];

/**
 * 기본 제외 패턴
 */
export const DEFAULT_EXCLUDE_PATTERNS = [
  '**/node_modules/**',
  '**/.next/**',
  '**/dist/**',
  '**/*.test.{ts,tsx}',
  '**/*.spec.{ts,tsx}',
  '**/__tests__/**',
  '**/*.d.ts',
  '**/coverage/**',
];

/**
 * 기본 설정으로 PluginConfig 생성
 */
export function createDefaultConfig(
  overrides: Partial<PluginConfig> = {}
): PluginConfig {
  return {
    projectId: overrides.projectId || 'default',
    include: overrides.include || DEFAULT_INCLUDE_PATTERNS,
    exclude: overrides.exclude || DEFAULT_EXCLUDE_PATTERNS,
    fileTypeMapping: {
      ...DEFAULT_FILE_TYPE_MAPPING,
      ...overrides.fileTypeMapping,
    },
    output: {
      file: {
        enabled: true,
        path: 'project-metadata.json',
        ...overrides.output?.file,
      },
      api: {
        enabled: false,
        endpoint: '',
        ...overrides.output?.api,
      },
    },
    koreanKeywords: overrides.koreanKeywords,
    mode: overrides.mode || 'production',
    verbose: overrides.verbose || false,
  };
}

/**
 * 설정 유효성 검증
 */
export function validateConfig(config: PluginConfig): string[] {
  const errors: string[] = [];

  if (!config.projectId) {
    errors.push('projectId is required');
  }

  if (config.output.api?.enabled && !config.output.api.endpoint) {
    errors.push('API endpoint is required when api output is enabled');
  }

  if (config.include.length === 0) {
    errors.push('At least one include pattern is required');
  }

  return errors;
}

/**
 * glob 패턴을 정규식으로 변환
 */
export function globToRegex(pattern: string): RegExp {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '{{GLOBSTAR}}')
    .replace(/\*/g, '[^/]*')
    .replace(/{{GLOBSTAR}}/g, '.*')
    .replace(/\{([^}]+)\}/g, (_, group) => {
      const alternatives = group.split(',').map((s: string) => s.trim());
      return `(${alternatives.join('|')})`;
    });
  return new RegExp(`^${escaped}$`);
}
