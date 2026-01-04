import * as fs from 'fs/promises';
import * as path from 'path';

export type ProjectType = 'nextjs-app' | 'nextjs-pages' | 'vite' | 'cra' | 'node' | 'unknown';
export type PackageManager = 'npm' | 'yarn' | 'pnpm';

export interface ProjectInfo {
  type: ProjectType;
  packageManager: PackageManager;
  hasTypescript: boolean;
  hasSrc: boolean;
  existingFolders: string[];
  hasPrisma: boolean;
  hasSupabase: boolean;
}

/**
 * 패키지 매니저 감지
 */
export async function detectPackageManager(rootDir: string): Promise<PackageManager> {
  const checks: { file: string; manager: PackageManager }[] = [
    { file: 'pnpm-lock.yaml', manager: 'pnpm' },
    { file: 'yarn.lock', manager: 'yarn' },
    { file: 'package-lock.json', manager: 'npm' },
  ];

  for (const { file, manager } of checks) {
    try {
      await fs.access(path.join(rootDir, file));
      return manager;
    } catch {
      // 파일 없음
    }
  }

  return 'npm'; // 기본값
}

/**
 * 프로젝트 타입 감지
 */
export async function detectProjectType(rootDir: string): Promise<ProjectType> {
  // package.json 읽기
  let packageJson: Record<string, unknown> = {};
  try {
    const content = await fs.readFile(path.join(rootDir, 'package.json'), 'utf-8');
    packageJson = JSON.parse(content);
  } catch {
    return 'unknown';
  }

  const deps = {
    ...(packageJson.dependencies as Record<string, string> || {}),
    ...(packageJson.devDependencies as Record<string, string> || {}),
  };

  // Next.js 감지
  if (deps['next']) {
    // App Router vs Pages Router
    const hasAppDir = await directoryExists(path.join(rootDir, 'app')) ||
                      await directoryExists(path.join(rootDir, 'src', 'app'));
    return hasAppDir ? 'nextjs-app' : 'nextjs-pages';
  }

  // Vite 감지
  if (deps['vite']) {
    return 'vite';
  }

  // Create React App 감지
  if (deps['react-scripts']) {
    return 'cra';
  }

  // Node.js 백엔드 감지
  if (deps['express'] || deps['fastify'] || deps['koa']) {
    return 'node';
  }

  return 'unknown';
}

/**
 * 전체 프로젝트 정보 감지
 */
export async function detectProject(rootDir: string): Promise<ProjectInfo> {
  const [type, packageManager] = await Promise.all([
    detectProjectType(rootDir),
    detectPackageManager(rootDir),
  ]);

  // TypeScript 감지
  const hasTypescript = await fileExists(path.join(rootDir, 'tsconfig.json'));

  // src 폴더 존재 여부
  const hasSrc = await directoryExists(path.join(rootDir, 'src'));

  // 존재하는 폴더들 확인
  const foldersToCheck = [
    'app', 'pages', 'components', 'hooks', 'services', 'lib', 'utils', 'api',
    'src/app', 'src/pages', 'src/components', 'src/hooks', 'src/services', 'src/lib', 'src/utils',
  ];

  const existingFolders: string[] = [];
  for (const folder of foldersToCheck) {
    if (await directoryExists(path.join(rootDir, folder))) {
      existingFolders.push(folder);
    }
  }

  // DB 마이그레이션 감지
  const hasPrisma = await directoryExists(path.join(rootDir, 'prisma'));
  const hasSupabase = await directoryExists(path.join(rootDir, 'supabase'));

  return {
    type,
    packageManager,
    hasTypescript,
    hasSrc,
    existingFolders,
    hasPrisma,
    hasSupabase,
  };
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * 프로젝트 타입에 맞는 설명
 */
export function getProjectTypeLabel(type: ProjectType): string {
  const labels: Record<ProjectType, string> = {
    'nextjs-app': 'Next.js (App Router)',
    'nextjs-pages': 'Next.js (Pages Router)',
    'vite': 'Vite + React',
    'cra': 'Create React App',
    'node': 'Node.js Backend',
    'unknown': 'Unknown',
  };
  return labels[type];
}
