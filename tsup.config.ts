import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    vite: 'src/vite.ts',
    next: 'src/next.ts',
    cli: 'src/cli.ts',
  },
  format: ['esm', 'cjs'],
  dts: {
    entry: {
      index: 'src/index.ts',
      vite: 'src/vite.ts',
      next: 'src/next.ts',
    },
  },
  splitting: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  external: ['vite', 'next', 'webpack', 'typescript'],
  esbuildOptions(options) {
    options.platform = 'node';
  },
});
