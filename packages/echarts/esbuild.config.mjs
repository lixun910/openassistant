import { createBaseConfig, buildFormat } from '../../esbuild.config.mjs';
import { dtsPlugin } from 'esbuild-plugin-d.ts';
import tailwindPlugin from 'esbuild-plugin-tailwindcss';

const isStart = process.argv.includes('--start');

const baseConfig = createBaseConfig({
  entryPoints: ['src/index.ts'],
  external: [
    'react',
    'react-dom',
    'echarts',
    '@openassistant/core',
    'sensorPool',
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
  plugins: [
    tailwindPlugin({
      config: './tailwind.config.js',
    }),
    dtsPlugin(),
  ],
  define: {
    'process.env.NODE_ENV': isStart ? '"development"' : '"production"',
  }
});

// Build all formats
Promise.all([
  buildFormat(baseConfig, 'esm', 'dist/index.esm.js'),
  buildFormat(baseConfig, 'cjs', 'dist/index.cjs.js'),
]).catch((error) => {
  console.error(error);
  process.exit(1);
});
