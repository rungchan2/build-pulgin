// 코어 타입 export
export type {
  FileType,
  CodeIndexItem,
  CodeMetadata,
  TableColumn,
  ParsedFile,
  ImportInfo,
  ExportInfo,
  PropInfo,
  PluginConfig,
  OutputConfig,
  AnalysisResult,
  AnalysisStats,
  CallGraphEntry,
} from './core/types';

// 설정 유틸리티 export
export {
  createDefaultConfig,
  validateConfig,
  DEFAULT_FILE_TYPE_MAPPING,
  DEFAULT_INCLUDE_PATTERNS,
  DEFAULT_EXCLUDE_PATTERNS,
} from './core/config';

// 분석기 export
export { ProjectAnalyzer } from './core/analyzer';

// 파서 export
export { TypeScriptParser } from './core/parsers/typescript-parser';
export { SQLParser } from './core/parsers/sql-parser';

// 추출기 export
export { ImportExtractor } from './core/extractors/import-extractor';
export { ExportExtractor } from './core/extractors/export-extractor';
export { PropsExtractor } from './core/extractors/props-extractor';
export { KeywordExtractor } from './core/extractors/keyword-extractor';

// 리졸버 export
export { DependencyResolver } from './core/resolvers/dependency-resolver';
export { CallGraphBuilder } from './core/resolvers/call-graph-builder';

// 출력 export
export { FileWriter } from './core/output/file-writer';
export { ApiSender, SupabaseApiSender } from './core/output/api-sender';

// 유틸리티 export
export {
  splitCamelCase,
  splitPascalCase,
  splitSnakeCase,
  splitKebabCase,
  splitIntoWords,
  extractAcronyms,
  toAllCases,
} from './utils/naming-utils';

export {
  KOREAN_KEYWORD_MAP,
  findKoreanKeywords,
  extendKoreanMap,
} from './utils/korean-mapper';

export { generateId } from './utils/id-utils';
