# metadatafy

A build plugin for extracting project metadata from your codebase. Supports Vite, Next.js, and CLI usage.

코드베이스에서 프로젝트 메타데이터를 추출하는 빌드 플러그인입니다. Vite, Next.js, CLI를 지원합니다.

## Features / 기능

- **AST-based analysis** - Parses TypeScript/JavaScript files using TypeScript compiler API
- **Code pattern detection** - Automatically detects file types by analyzing actual code (hooks, components, services, etc.)
- **Smart path detection** - Supports various folder structures and naming conventions
- **Import/Export extraction** - Tracks file dependencies and call graphs
- **Component props detection** - Extracts React component props
- **Korean keyword mapping** - Automatic English-Korean keyword translation
- **Multiple output formats** - JSON file, API endpoint, or Supabase database

---

- **AST 기반 분석** - TypeScript 컴파일러 API를 사용한 파일 파싱
- **코드 패턴 감지** - 실제 코드 분석으로 파일 타입 자동 감지 (hooks, components, services 등)
- **스마트 경로 감지** - 다양한 폴더 구조와 네이밍 컨벤션 지원
- **Import/Export 추출** - 파일 의존성 및 호출 그래프 추적
- **컴포넌트 Props 감지** - React 컴포넌트 props 추출
- **한글 키워드 매핑** - 영어-한글 키워드 자동 변환
- **다양한 출력 형식** - JSON 파일, API 엔드포인트, 또는 Supabase 데이터베이스

## Installation / 설치

```bash
npm install metadatafy
# or
yarn add metadatafy
# or
pnpm add metadatafy
```

## Quick Start / 빠른 시작

The easiest way to get started is with the interactive setup wizard:

가장 쉽게 시작하는 방법은 인터랙티브 설정 마법사를 사용하는 것입니다:

```bash
npx metadatafy init
```

This will:
- Auto-detect your project type (Next.js, Vite, CRA, etc.)
- Detect your package manager (npm, yarn, pnpm)
- Create a `metadata.config.json` with optimized settings
- Optionally add the plugin to your build config (vite.config.ts or next.config.js)
- Optionally configure Supabase integration for automatic uploads

이 명령어는:
- 프로젝트 타입 자동 감지 (Next.js, Vite, CRA 등)
- 패키지 매니저 감지 (npm, yarn, pnpm)
- 최적화된 설정으로 `metadata.config.json` 생성
- 선택적으로 빌드 설정에 플러그인 추가 (vite.config.ts 또는 next.config.js)
- 선택적으로 Supabase 연동 설정 (자동 업로드)

## Usage / 사용법

### CLI

```bash
# Interactive setup (recommended for new projects)
# 인터랙티브 설정 (새 프로젝트에 권장)
npx metadatafy init

# Analyze project and generate metadata (file only)
# 프로젝트 분석 및 메타데이터 생성 (파일만)
npx metadatafy analyze

# Analyze + upload to database
# 분석 + 데이터베이스 업로드
npx metadatafy analyze --upload

# Analyze without DB upload (even if configured)
# 분석만 (DB 업로드 스킵)
npx metadatafy analyze --no-upload

# Upload existing metadata file to database
# 기존 메타데이터 파일을 DB에 업로드
npx metadatafy upload

# With options / 옵션과 함께
npx metadatafy analyze --project-id my-project --output ./metadata.json --verbose
```

#### CLI Commands / CLI 명령어

| Command | Description |
|---------|-------------|
| `init` | Interactive setup wizard / 인터랙티브 설정 마법사 |
| `analyze` | Analyze project and generate metadata / 프로젝트 분석 및 메타데이터 생성 |
| `upload` | Upload existing metadata file to database / 기존 메타데이터 파일을 DB에 업로드 |
| `database-init` | Database connection setup (Supabase, etc.) / 데이터베이스 연동 설정 |

#### Analyze Options / Analyze 옵션

| Option | Short | Description |
|--------|-------|-------------|
| `--project-id` | `-p` | Project ID (default: folder name) |
| `--output` | `-o` | Output file path (default: project-metadata.json) |
| `--config` | `-c` | Config file path |
| `--upload` | | Force DB upload / DB 업로드 강제 실행 |
| `--no-upload` | | Skip DB upload / DB 업로드 스킵 |
| `--verbose` | | Enable detailed logging |
| `--help` | `-h` | Show help |

### Vite Plugin

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { metadataPlugin } from 'metadatafy/vite';

export default defineConfig({
  plugins: [
    metadataPlugin({
      projectId: 'my-project',
      output: {
        file: {
          enabled: true,
          path: 'project-metadata.json',
        },
      },
    }),
  ],
});
```

### Next.js Plugin

#### Next.js 16+ (Turbopack) - Recommended

```javascript
// metadata-adapter.js
const { createMetadataAdapter } = require('metadatafy/next');

module.exports = createMetadataAdapter({
  projectId: 'my-project',
  verbose: true,
  output: {
    file: { enabled: true, path: 'project-metadata.json' },
  },
});
```

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    adapterPath: require.resolve('./metadata-adapter.js'),
  },
};

export default nextConfig;
```

#### Next.js 15 or Earlier (Webpack)

```javascript
// next.config.js
const { withMetadata } = require('metadatafy/next');

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withMetadata({
  projectId: 'my-project',
})(nextConfig);
```

## File Type Detection / 파일 타입 감지

metadatafy uses a **hybrid detection system** that combines multiple approaches:

metadatafy는 여러 접근 방식을 결합한 **하이브리드 감지 시스템**을 사용합니다:

### Detection Priority / 감지 우선순위

1. **Next.js special files** - `page.tsx`, `layout.tsx`, `route.ts` → route/api
2. **Path segments** - `/api/` in path → api
3. **Folder names** - `components/`, `hooks/`, `utils/`, `lib/` → corresponding type
4. **Code pattern analysis** - AST-based detection of actual code patterns
5. **Glob patterns** - User-defined patterns in config

### Code Pattern Detection / 코드 패턴 감지

When folder/path detection fails, metadatafy analyzes the actual code:

폴더/경로 감지가 실패하면 실제 코드를 분석합니다:

| Type | Detection Pattern |
|------|-------------------|
| **hook** | Uses `useState`, `useEffect`, etc. / Function starts with `use` |
| **component** | Returns JSX / Has `props` parameter |
| **api** | Exports `GET`, `POST`, etc. / Uses `NextRequest`/`NextResponse` |
| **service** | Uses `fetch`, `axios` / Multiple async functions / `*Service` class |
| **utility** | Multiple exported functions / No React dependencies |

### Supported Naming Conventions / 지원하는 네이밍 컨벤션

All naming conventions are supported:

모든 네이밍 컨벤션을 지원합니다:

| Type | Examples |
|------|----------|
| **hook** | `useAuth.ts`, `use-auth.ts`, `use_auth.ts` |
| **service** | `AuthService.ts`, `auth-service.ts`, `auth.service.ts` |
| **utility** | `string-utils.ts`, `date_helper.ts`, `formatUtil.ts` |
| **component** | `Button.tsx`, `auth-modal.tsx`, `user_profile.tsx` |

### Auto Pattern Expansion / 자동 패턴 확장

Include patterns are automatically expanded to match nested structures:

include 패턴은 중첩 구조에 맞게 자동 확장됩니다:

```json
{
  "include": ["hooks/**/*.ts"]
}
```

This will match both:
- `hooks/useAuth.ts`
- `src/hooks/useAuth.ts`
- `src/features/auth/hooks/useAuth.ts`

## Configuration / 설정

Create `metadata.config.json` in your project root:

프로젝트 루트에 `metadata.config.json` 파일을 생성하세요:

```json
{
  "projectId": "my-project",
  "include": [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
    "services/**/*.ts",
    "lib/**/*.ts"
  ],
  "exclude": [
    "**/node_modules/**",
    "**/*.test.{ts,tsx}",
    "**/*.spec.{ts,tsx}"
  ],
  "output": {
    "file": {
      "enabled": true,
      "path": "project-metadata.json"
    },
    "database": {
      "enabled": true,
      "provider": "supabase",
      "supabase": {
        "url": "${SUPABASE_URL}",
        "serviceRoleKey": "${SUPABASE_SERVICE_ROLE_KEY}",
        "tableName": "code_index"
      }
    }
  },
  "koreanKeywords": {
    "attendance": ["출석", "출결"],
    "student": ["학생", "수강생"]
  },
  "verbose": false
}
```

## Output Format / 출력 형식

```json
{
  "projectId": "my-project",
  "timestamp": "2025-01-04T12:00:00Z",
  "stats": {
    "totalFiles": 150,
    "byType": {
      "route": 15,
      "component": 80,
      "hook": 20,
      "service": 10,
      "api": 5,
      "table": 8,
      "utility": 12
    }
  },
  "items": [
    {
      "id": "abc123",
      "type": "component",
      "name": "AttendanceModal",
      "path": "components/attendance/AttendanceModal.tsx",
      "keywords": ["attendance", "modal", "출석", "모달"],
      "searchText": "attendancemodal components attendance ...",
      "calls": ["hooks/useAttendance.ts", "services/attendanceService.ts"],
      "calledBy": ["app/attendance/page.tsx"],
      "metadata": {
        "exports": ["AttendanceModal"],
        "props": ["isOpen", "onClose", "studentId"]
      }
    }
  ]
}
```

## Database Integration / 데이터베이스 연동

### Supabase Table Schema / Supabase 테이블 스키마

metadatafy stores each file as an individual row for better queryability:

metadatafy는 더 나은 쿼리를 위해 각 파일을 개별 row로 저장합니다:

```sql
-- File type enum
CREATE TYPE file_type AS ENUM (
  'route', 'component', 'hook', 'service', 'api', 'table', 'utility'
);

-- Main table: individual code file metadata
CREATE TABLE code_index (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  file_type file_type NOT NULL,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  search_text TEXT,
  calls TEXT[] DEFAULT '{}',
  called_by TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, path)
);

-- Analysis log table
CREATE TABLE code_analysis_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id TEXT NOT NULL,
  total_files INTEGER NOT NULL,
  stats JSONB NOT NULL,
  parse_errors TEXT[] DEFAULT '{}',
  analyzed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for search optimization
CREATE INDEX idx_code_index_project_id ON code_index(project_id);
CREATE INDEX idx_code_index_file_type ON code_index(file_type);
CREATE INDEX idx_code_index_keywords ON code_index USING GIN(keywords);
CREATE INDEX idx_code_index_search_text ON code_index USING GIN(to_tsvector('simple', search_text));

-- RLS Policies
ALTER TABLE code_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_analysis_log ENABLE ROW LEVEL SECURITY;

-- Read access for authenticated users
CREATE POLICY "Authenticated users can read code_index"
  ON code_index FOR SELECT TO authenticated USING (true);

-- Write access for service role only
CREATE POLICY "Service role can manage code_index"
  ON code_index FOR ALL TO service_role USING (true) WITH CHECK (true);
```

### Configuration / 설정

```json
{
  "output": {
    "database": {
      "enabled": true,
      "provider": "supabase",
      "supabase": {
        "url": "${SUPABASE_URL}",
        "serviceRoleKey": "${SUPABASE_SERVICE_ROLE_KEY}",
        "tableName": "code_index"
      }
    }
  }
}
```

### Environment Variables / 환경변수

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### How It Works / 작동 방식

1. **Delete existing project data** - Removes all rows with matching `project_id`
2. **Bulk insert new data** - Inserts all files in chunks of 500
3. **Log analysis run** - Records stats in `code_analysis_log` table

---

1. **기존 프로젝트 데이터 삭제** - 동일한 `project_id`의 모든 row 삭제
2. **새 데이터 일괄 삽입** - 500개 단위로 모든 파일 삽입
3. **분석 로그 기록** - `code_analysis_log` 테이블에 통계 기록

### Querying Code / 코드 쿼리 예시

```sql
-- Find all hooks in a project
SELECT * FROM code_index
WHERE project_id = 'my-project' AND file_type = 'hook';

-- Full-text search
SELECT * FROM code_index
WHERE project_id = 'my-project'
  AND search_text ILIKE '%authentication%';

-- Find files that call a specific file
SELECT * FROM code_index
WHERE 'hooks/useAuth.ts' = ANY(calls);

-- Get analysis history
SELECT * FROM code_analysis_log
WHERE project_id = 'my-project'
ORDER BY analyzed_at DESC;
```

### Recommended Workflow / 권장 워크플로우

```bash
# Generate metadata + upload
npx metadatafy analyze --upload

# Or in CI/CD
npx metadatafy analyze --upload
```

**GitHub Actions:**

```yaml
- run: npm run build
- run: npx metadatafy analyze --upload
  env:
    SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

## API / 프로그래밍 방식 사용

```typescript
import { ProjectAnalyzer, createDefaultConfig } from 'metadatafy';

const config = createDefaultConfig({
  projectId: 'my-project',
  verbose: true,
});

const analyzer = new ProjectAnalyzer(config);
const result = await analyzer.analyze(process.cwd());

console.log(result.stats);
console.log(result.items);
```

## Korean Keyword Mapping / 한글 키워드 매핑

Built-in mappings include common development terms:

기본 제공되는 매핑에는 일반적인 개발 용어가 포함됩니다:

| English | Korean |
|---------|--------|
| create | 생성, 만들기, 추가 |
| update | 수정, 업데이트, 변경 |
| delete | 삭제, 제거 |
| search | 검색, 찾기 |
| login | 로그인 |
| user | 사용자, 유저, 회원 |

You can extend with custom mappings in config.

설정에서 커스텀 매핑을 추가할 수 있습니다.

## License / 라이선스

MIT

## Contributing / 기여

Issues and pull requests are welcome!

이슈와 풀 리퀘스트를 환영합니다!

GitHub: https://github.com/rungchan2/metadatafy
