// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  createBaseConfig,
  buildFormat,
  createWatchMode,
} from '../../../esbuild.config.mjs';
import { dtsPlugin } from 'esbuild-plugin-d.ts';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';

const isStart = process.argv.includes('--start');
const isWatch = process.argv.includes('--watch');

const baseConfig = createBaseConfig({
  entryPoints: ['src/index.ts'],
  external: [
    '@jspm/core',
    '@jspm/core/*',
    '@ai-sdk/openai-compatible',
    '@ai-sdk/react',
    '@openassistant/utils',
    '@sqlrooms/data-table',
    '@sqlrooms/monaco-editor',
    '@sqlrooms/recharts',
    '@sqlrooms/ui',
    '@sqlrooms/utils',
    'ai',
    'clsx',
    'immer',
    'lucide-react',
    'react-markdown',
    'recharts',
    'rehype-raw',
    'remark-gfm',
    'tailwind-merge',
    'zod',
    'zustand',
  ],
  loader: {
    '.js': 'jsx',
    '.ts': 'tsx',
    '.png': 'file',
    '.jpg': 'file',
    '.svg': 'file',
    '.css': 'css',
  },
  jsx: 'automatic',
  // Only include DTS plugin by default; add node polyfills only for browser/ESM builds
  plugins: [dtsPlugin()],
  define: {
    'process.env.NODE_ENV': isStart ? '"development"' : '"production"',
  },
  mainFields: ['module', 'main'],
  resolveExtensions: ['.js', '.jsx', '.ts', '.tsx'],
  nodePaths: ['node_modules'],
});

if (isWatch) {
  // Create watch mode for both ESM and CJS formats
  const esmConfig = {
    ...baseConfig,
    format: 'esm',
    outfile: 'dist/index.esm.js',
    plugins: [...(baseConfig.plugins || []), polyfillNode()],
  };
  const cjsConfig = {
    ...baseConfig,
    format: 'cjs',
    outfile: 'dist/index.cjs.js',
    platform: 'node',
    target: ['node18'],
  };

  // Start watching both formats
  await createWatchMode(esmConfig);
  await createWatchMode(cjsConfig);
} else {
  // Build all formats
  Promise.all([
    buildFormat(
      { ...baseConfig, plugins: [...(baseConfig.plugins || []), polyfillNode()] },
      'esm',
      'dist/index.esm.js'
    ),
    buildFormat(baseConfig, 'cjs', 'dist/index.cjs.js'),
  ]).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
