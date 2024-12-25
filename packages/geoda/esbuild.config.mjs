import { createBaseConfig, buildFormat } from '../../esbuild.config.mjs';
import { dtsPlugin } from 'esbuild-plugin-d.ts';

const baseConfig = createBaseConfig({
  entryPoints: ['src/index.ts'],
  external: ['react'],
  plugins: [dtsPlugin()],
});

// Build all formats
Promise.all([
  buildFormat(baseConfig, 'esm', 'dist/index.esm.js'),
  buildFormat(baseConfig, 'cjs', 'dist/index.cjs.js'),
]).catch(() => process.exit(1));
