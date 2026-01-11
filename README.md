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
- **Multiple output formats** - JSON file, Supabase, or custom API server
- **Global CLI** - Install once, use everywhere

---

- **AST 기반 분석** - TypeScript 컴파일러 API를 사용한 파일 파싱
- **코드 패턴 감지** - 실제 코드 분석으로 파일 타입 자동 감지 (hooks, components, services 등)
- **스마트 경로 감지** - 다양한 폴더 구조와 네이밍 컨벤션 지원
- **Import/Export 추출** - 파일 의존성 및 호출 그래프 추적
- **컴포넌트 Props 감지** - React 컴포넌트 props 추출
- **한글 키워드 매핑** - 영어-한글 키워드 자동 변환
- **다양한 출력 형식** - JSON 파일, Supabase, 또는 커스텀 API 서버
- **글로벌 CLI** - 한 번 설치로 어디서나 사용

## Installation / 설치

### Global CLI (Recommended) / 글로벌 CLI (권장)

```bash
npm install -g metadatafy
```

Now you can use `metadatafy` command anywhere:

이제 어디서나 `metadatafy` 명령어를 사용할 수 있습니다:

```bash
metadatafy --help
metadatafy config setup
metadatafy analyze
```

### Per-project / 프로젝트별 설치

```bash
npm install -D metadatafy
# or
yarn add -D metadatafy
# or
pnpm add -D metadatafy
```

## Quick Start / 빠른 시작

### 1. Global Setup (One-time) / 글로벌 설정 (1회)

```bash
# Install globally
npm install -g metadatafy

# Configure upload destination (Supabase or API server)
metadatafy config setup
```

### 2. Project Setup / 프로젝트 설정

```bash
# In your project directory
metadatafy init
```

### 3. Analyze & Upload / 분석 및 업로드

```bash
# Analyze only (generates local JSON file)
metadatafy analyze

# Analyze + upload to configured destination
metadatafy analyze --upload
```

## CLI Commands / CLI 명령어

### Global Config / 글로벌 설정

Settings are stored in `~/.metadatafy/` and shared across all projects.

설정은 `~/.metadatafy/`에 저장되며 모든 프로젝트에서 공유됩니다.

```bash
# Interactive setup wizard
metadatafy config setup

# Show current config
metadatafy config show

# Set individual values
metadatafy config set database.provider supabase
metadatafy config set api.serverUrl https://my-server.com

# Reset all config
metadatafy config reset
```

### Authentication (for API server mode) / 인증 (API 서버 모드용)

```bash
# Login via browser (OAuth)
metadatafy login

# Check login status
metadatafy whoami

# Logout
metadatafy logout
```

### Project Commands / 프로젝트 명령어

```bash
# Initialize project config
metadatafy init

# Analyze project
metadatafy analyze

# Analyze with upload
metadatafy analyze --upload

# Upload existing metadata file
metadatafy upload
```

### Command Reference / 명령어 레퍼런스

| Command | Description |
|---------|-------------|
| `config setup` | Interactive global config wizard / 대화형 글로벌 설정 |
| `config show` | Display current config / 현재 설정 표시 |
| `config set <key> <value>` | Set config value / 설정값 변경 |
| `config reset` | Reset all config / 모든 설정 초기화 |
| `login` | OAuth login to API server / API 서버 로그인 |
| `logout` | Clear login session / 로그아웃 |
| `whoami` | Show login status / 로그인 상태 확인 |
| `init` | Initialize project config / 프로젝트 설정 초기화 |
| `analyze` | Analyze project and generate metadata / 분석 및 메타데이터 생성 |
| `upload` | Upload existing metadata file / 기존 메타데이터 업로드 |

### Analyze Options / Analyze 옵션

| Option | Short | Description |
|--------|-------|-------------|
| `--output` | `-o` | Output file path (default: project-metadata.json) |
| `--config` | `-c` | Config file path |
| `--upload` | | Upload to configured destination |
| `--verbose` | | Enable detailed logging |
| `--help` | `-h` | Show help |

## Upload Modes / 업로드 모드

metadatafy supports 3 upload modes:

metadatafy는 3가지 업로드 모드를 지원합니다:

### 1. Local File Only / 로컬 파일만

No upload, just generate `project-metadata.json`:

업로드 없이 `project-metadata.json`만 생성:

```bash
metadatafy analyze
```

### 2. Supabase Direct / Supabase 직접 연결

Connect to your own Supabase instance:

자신의 Supabase 인스턴스에 직접 연결:

```bash
metadatafy config setup
# Select: 1) Supabase 직접 연결
# Enter: Supabase URL, Service Role Key, Table name
```

### 3. API Server / API 서버

Upload via API server (requires login):

API 서버를 통해 업로드 (로그인 필요):

```bash
metadatafy config setup
# Select: 2) API 서버

metadatafy login
metadatafy init  # Select project from server
metadatafy analyze --upload
```

## Vite Plugin

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import metadatafy from 'metadatafy/vite';

export default defineConfig({
  plugins: [
    metadatafy({
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

## Next.js Plugin

### Next.js 15+ with Turbopack

For Next.js 15+ with Turbopack, use CLI instead of webpack plugin:

Next.js 15+ Turbopack 환경에서는 webpack 플러그인 대신 CLI를 사용하세요:

```json
// package.json
{
  "scripts": {
    "build": "next build && metadatafy analyze --upload"
  }
}
```

### Next.js 14 or Earlier (Webpack)

```javascript
// next.config.js
const { withMetadatafy } = require('metadatafy/next');

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withMetadatafy()(nextConfig);
```

## Configuration File / 설정 파일

Project-level config is stored in `metadata.config.json`:

프로젝트 레벨 설정은 `metadata.config.json`에 저장됩니다:

```json
{
  "projectId": "my-project",
  "projectUuid": "uuid-from-server",
  "include": [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}"
  ],
  "exclude": [
    "**/node_modules/**",
    "**/*.test.{ts,tsx}"
  ],
  "output": {
    "file": {
      "enabled": true,
      "path": "project-metadata.json"
    }
  },
  "koreanKeywords": {
    "attendance": ["출석", "출결"]
  },
  "verbose": false
}
```

## Database Schema / 데이터베이스 스키마

If using Supabase direct mode, create this table:

Supabase 직접 연결 모드 사용 시 이 테이블을 생성하세요:

```sql
CREATE TABLE code_index (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  file_type TEXT NOT NULL,
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

-- Indexes
CREATE INDEX idx_code_index_project_id ON code_index(project_id);
CREATE INDEX idx_code_index_file_type ON code_index(file_type);
CREATE INDEX idx_code_index_keywords ON code_index USING GIN(keywords);
```

## Output Format / 출력 형식

```json
{
  "projectId": "my-project",
  "timestamp": "2025-01-11T12:00:00Z",
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
      "calls": ["hooks/useAttendance.ts"],
      "calledBy": ["app/attendance/page.tsx"],
      "metadata": {
        "exports": ["AttendanceModal"],
        "props": ["isOpen", "onClose", "studentId"]
      }
    }
  ]
}
```

## CI/CD Integration / CI/CD 연동

### GitHub Actions

```yaml
name: Analyze Code
on:
  push:
    branches: [main]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci
      - run: npm run build

      # Using Supabase direct
      - run: npx metadatafy analyze --upload
        env:
          METADATAFY_DB_URL: ${{ secrets.SUPABASE_URL }}
          METADATAFY_DB_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

## API Usage / 프로그래밍 방식 사용

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

## File Type Detection / 파일 타입 감지

metadatafy uses a hybrid detection system:

1. **Next.js special files** - `page.tsx`, `layout.tsx`, `route.ts` → route/api
2. **Path segments** - `/api/` in path → api
3. **Folder names** - `components/`, `hooks/`, `utils/` → corresponding type
4. **Code pattern analysis** - AST-based detection

| Type | Detection Pattern |
|------|-------------------|
| **hook** | Uses `useState`, `useEffect` / Function starts with `use` |
| **component** | Returns JSX / Has `props` parameter |
| **api** | Exports `GET`, `POST` / Uses `NextRequest` |
| **service** | Uses `fetch`, `axios` / `*Service` class |
| **utility** | Multiple exported functions / No React |

## Korean Keyword Mapping / 한글 키워드 매핑

Built-in mappings:

| English | Korean |
|---------|--------|
| create | 생성, 만들기, 추가 |
| update | 수정, 업데이트, 변경 |
| delete | 삭제, 제거 |
| search | 검색, 찾기 |
| login | 로그인 |
| user | 사용자, 유저, 회원 |

Extend with custom mappings in `metadata.config.json`.

## License / 라이선스

MIT

## Contributing / 기여

Issues and pull requests are welcome!

GitHub: https://github.com/rungchan2/metadatafy
