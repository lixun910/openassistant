import {
  createBaseConfig,
  createDevServer,
  buildFormat,
} from '../../esbuild.config.mjs';
import tailwindPlugin from 'esbuild-plugin-tailwindcss';
import { dtsPlugin } from 'esbuild-plugin-d.ts';

const baseConfig = createBaseConfig({
  entryPoints: ['src/main.tsx'],
  loader: {
    '.js': 'jsx',
    '.ts': 'tsx',
    '.png': 'file',
    '.jpg': 'file',
    '.svg': 'file',
    '.css': 'css',
  },
  jsx: 'automatic',
  plugins: [
    tailwindPlugin({
      config: './tailwind.config.js',
    }),
    dtsPlugin(),
  ],
  external: ['react', 'react-dom', '@langchain', 'html2canvas'],
  alias: {
    '@openassistant/core': '../core/src/index.ts',
  },
});

const isStart = process.argv.includes('--start');

if (isStart) {
  createDevServer(baseConfig, 3001).catch((e) => {
    console.error(e);
    process.exit(1);
  });
} else {
  // Build all formats
  Promise.all([
    buildFormat(baseConfig, 'cjs', 'dist/index.cjs.js'),
    buildFormat(baseConfig, 'esm', 'dist/index.esm.js'),
    buildFormat(baseConfig, 'iife', 'dist/index.iife.js'),
  ]).catch((error) => {
    console.error(error);
    console.error('Failed to build UI package');
    process.exit(1);
  });
}
