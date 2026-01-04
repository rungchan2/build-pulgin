export { metadataPlugin as default } from './adapters/vite-adapter';
export { metadataPlugin } from './adapters/vite-adapter';
export type { VitePluginOptions } from './adapters/vite-adapter';

// 코어 타입도 re-export
export type {
  PluginConfig,
  CodeIndexItem,
  AnalysisResult,
} from './core/types';
