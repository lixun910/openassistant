import {
  createBaseConfig,
  buildFormat,
  createWatchMode,
} from '../../esbuild.config.mjs';
import { dtsPlugin } from 'esbuild-plugin-d.ts';

const isWatch = process.argv.includes('--watch');

const baseConfig = createBaseConfig({
  minify: true,
  sourcemap: true,
  entryPoints: ['src/index.ts'],
  external: [
    'react',
    '@ai-sdk/anthropic',
    '@ai-sdk/deepseek',
    '@ai-sdk/google',
    '@ai-sdk/openai',
    '@ai-sdk/xai',
    '@ai-sdk/react',
    '@ai-sdk/ui-utils',
    'ollama-ai-provider',
    'openai',
    'p-retry',
    'p-queue',
    'openai-zod-functions',
  ],
  plugins: [dtsPlugin()],
});

if (isWatch) {
  // Create watch mode for both ESM and CJS formats
  const esmConfig = {
    ...baseConfig,
    format: 'esm',
    outfile: 'dist/index.esm.js',
  };
  const cjsConfig = {
    ...baseConfig,
    format: 'cjs',
    outfile: 'dist/index.cjs.js',
    platform: 'node',
    target: ['es2017'],
  };

  // Start watching both formats
  await createWatchMode(esmConfig);
  await createWatchMode(cjsConfig);
} else {
  // Build all formats
  Promise.all([
    buildFormat(baseConfig, 'esm', 'dist/index.esm.js'),
    buildFormat(baseConfig, 'cjs', 'dist/index.cjs.js'),
  ]).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
