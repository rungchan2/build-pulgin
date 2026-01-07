import * as readline from 'readline';
import type { ProjectType, PackageManager } from './detector';

let rl: readline.Interface | null = null;

function getReadline(): readline.Interface {
  if (!rl) {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });
  }
  return rl;
}

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(query);
    getReadline().once('line', (answer) => {
      resolve(answer);
    });
  });
}

export function close() {
  if (rl) {
    rl.close();
    rl = null;
  }
}

/**
 * 프로젝트 타입 선택
 */
export async function selectProjectType(detected: ProjectType): Promise<ProjectType> {
  const options: { key: string; type: ProjectType; label: string }[] = [
    { key: '1', type: 'nextjs-app', label: 'Next.js (App Router)' },
    { key: '2', type: 'nextjs-pages', label: 'Next.js (Pages Router)' },
    { key: '3', type: 'vite', label: 'Vite + React' },
    { key: '4', type: 'cra', label: 'Create React App' },
    { key: '5', type: 'node', label: 'Node.js Backend' },
  ];

  const detectedIndex = options.findIndex((o) => o.type === detected);
  const defaultKey = detectedIndex >= 0 ? options[detectedIndex].key : '1';

  console.log('\n📦 프로젝트 타입을 선택하세요:');
  options.forEach((opt) => {
    const isDetected = opt.type === detected;
    const marker = isDetected ? ' (감지됨)' : '';
    console.log(`  ${opt.key}) ${opt.label}${marker}`);
  });

  const answer = await question(`\n선택 [${defaultKey}]: `);
  const selected = answer.trim() || defaultKey;

  const choice = options.find((o) => o.key === selected);
  return choice?.type || detected;
}

/**
 * 패키지 매니저 선택
 */
export async function selectPackageManager(detected: PackageManager): Promise<PackageManager> {
  const options: { key: string; manager: PackageManager }[] = [
    { key: '1', manager: 'npm' },
    { key: '2', manager: 'yarn' },
    { key: '3', manager: 'pnpm' },
  ];

  const detectedIndex = options.findIndex((o) => o.manager === detected);
  const defaultKey = detectedIndex >= 0 ? options[detectedIndex].key : '1';

  console.log('\n📦 패키지 매니저를 선택하세요:');
  options.forEach((opt) => {
    const isDetected = opt.manager === detected;
    const marker = isDetected ? ' (감지됨)' : '';
    console.log(`  ${opt.key}) ${opt.manager}${marker}`);
  });

  const answer = await question(`\n선택 [${defaultKey}]: `);
  const selected = answer.trim() || defaultKey;

  const choice = options.find((o) => o.key === selected);
  return choice?.manager || detected;
}

/**
 * 빌드 도구 연동 여부
 */
export async function confirmBuildIntegration(projectType: ProjectType): Promise<boolean> {
  if (projectType === 'node' || projectType === 'unknown') {
    return false;
  }

  const toolName = projectType.startsWith('nextjs') ? 'next.config' : 'vite.config';
  console.log(`\n🔧 ${toolName} 파일에 metadatafy 플러그인을 자동으로 추가할까요?`);
  console.log('  빌드 시 자동으로 메타데이터가 생성됩니다.');

  const answer = await question('\n추가할까요? [Y/n]: ');
  return answer.trim().toLowerCase() !== 'n';
}


/**
 * 확인
 */
export async function confirm(message: string, defaultYes = true): Promise<boolean> {
  const hint = defaultYes ? '[Y/n]' : '[y/N]';
  const answer = await question(`${message} ${hint}: `);
  const trimmed = answer.trim().toLowerCase();

  if (trimmed === '') {
    return defaultYes;
  }
  return trimmed === 'y' || trimmed === 'yes';
}

/**
 * Supabase 연동 여부
 */
export async function askSupabaseIntegration(): Promise<boolean> {
  console.log('\n🗄️  Supabase에 메타데이터를 자동 저장할까요?');
  console.log('  빌드 시 자동으로 데이터베이스에 업로드됩니다.');

  const answer = await question('\nSupabase 연동 설정? [y/N]: ');
  return answer.trim().toLowerCase() === 'y';
}

/**
 * Supabase 설정 입력
 */
export interface SupabaseSetupResult {
  /** 환경변수 이름 (config.json에 저장) */
  urlEnvName: string;
  serviceRoleKeyEnvName: string;
  tableName: string;
  /** 실제 값 (.env에 저장) */
  urlValue: string;
  serviceRoleKeyValue: string;
}

export async function askSupabaseSetup(): Promise<SupabaseSetupResult | null> {
  console.log('\n🔧 Supabase 설정');
  console.log('Settings > API에서 확인할 수 있습니다.\n');

  // 환경변수 이름 입력
  console.log('📝 환경변수 이름 설정 (config.json에 저장됨)');
  const urlEnvInput = await question('  Supabase URL 환경변수 이름 [SUPABASE_URL]: ');
  const keyEnvInput = await question('  Service Role Key 환경변수 이름 [SUPABASE_SERVICE_ROLE_KEY]: ');

  const urlEnvName = urlEnvInput.trim() || 'SUPABASE_URL';
  const keyEnvName = keyEnvInput.trim() || 'SUPABASE_SERVICE_ROLE_KEY';

  // 실제 값 입력
  console.log('\n🔑 환경변수 값 설정 (.env 파일에 저장됨)');
  console.log('  ⚠️  Service Role Key는 절대 외부에 노출하지 마세요!\n');

  const urlValue = await question(`  ${urlEnvName} 값 (예: https://xxx.supabase.co): `);
  const keyValue = await question(`  ${keyEnvName} 값: `);

  if (!urlValue.trim() || !keyValue.trim()) {
    console.log('\n⚠️  URL과 Service Role Key는 필수입니다.');
    const skipSetup = await confirm('환경변수 없이 계속할까요? (나중에 수동 설정 필요)', false);
    if (skipSetup) {
      return {
        urlEnvName,
        serviceRoleKeyEnvName: keyEnvName,
        tableName: 'project_metadata',
        urlValue: '',
        serviceRoleKeyValue: '',
      };
    }
    return null;
  }

  // 테이블 이름 입력
  const tableInput = await question('\n  테이블 이름 [project_metadata]: ');
  const tableName = tableInput.trim() || 'project_metadata';

  return {
    urlEnvName,
    serviceRoleKeyEnvName: keyEnvName,
    tableName,
    urlValue: urlValue.trim(),
    serviceRoleKeyValue: keyValue.trim(),
  };
}
