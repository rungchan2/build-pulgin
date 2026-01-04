export { withMetadata as default } from './adapters/next-adapter';
export { withMetadata } from './adapters/next-adapter';
export type { NextPluginOptions } from './adapters/next-adapter';

// 코어 타입도 re-export
export type {
  PluginConfig,
  CodeIndexItem,
  AnalysisResult,
} from './core/types';
