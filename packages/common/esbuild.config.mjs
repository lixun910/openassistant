// duckdb/esbuild.config.mjs
import {
  createBaseConfig,
  createDevServer,
  buildFormat,
} from '../../esbuild.config.mjs';
import tailwindPlugin from 'esbuild-plugin-tailwindcss';
import { dtsPlugin } from 'esbuild-plugin-d.ts';

const baseConfig = createBaseConfig({
  entryPoints: ['src/index.ts'],
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
  external: [
    'react',
    'react-dom',
    '@nextui-org/react',
    'framer-motion',
    'tailwindcss',
    '@iconify/react',
  ],
});

// Build all formats
Promise.all([
  buildFormat(baseConfig, 'cjs', 'dist/index.cjs.js'),
  buildFormat(baseConfig, 'esm', 'dist/index.esm.js'),
  buildFormat(baseConfig, 'iife', 'dist/index.iife.js'),
]).catch((error) => {
  console.error(error);
  process.exit(1);
});
