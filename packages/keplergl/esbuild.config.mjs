import { createBaseConfig, buildFormat } from '../../esbuild.config.mjs';
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
  minify: false,
  plugins: [dtsPlugin()],
  external: [
    'react',
    'react-dom',
    'react-palm',
    'react-redux',
    'redux',
    'styled-components',
    'use-sync-external-store',
    '@openassistant/core',
    '@openassistant/common',
    '@kepler.gl/actions',
    '@kepler.gl/components',
    '@kepler.gl/constants',
    '@kepler.gl/layers',
    '@kepler.gl/reducers',
    '@kepler.gl/processors',
    '@kepler.gl/styles',
    '@kepler.gl/utils',
  ],
  treeShaking: true,
});

// Build all formats
Promise.all([
  buildFormat(baseConfig, 'esm', 'dist/index.esm.js'),
  buildFormat(baseConfig, 'cjs', 'dist/index.cjs.js'),
]).catch((error) => {
  console.error(error);
  process.exit(1);
});
