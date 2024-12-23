import esbuild from 'esbuild';
import fs from 'fs';

const baseConfig = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  metafile: true,
  external: ['react', '@langchain/core', '@langchain/google-genai', '@langchain/ollama', '@langchain/openai'],
};

// ESM build
esbuild
  .build({
    ...baseConfig,
    outfile: 'dist/index.esm.js',
    format: 'esm',
  })
  .then((result) => {
    fs.writeFileSync('dist/meta.esm.json', JSON.stringify(result.metafile));
    console.log('ESM build complete! ✨');
  })
  .catch(() => process.exit(1));

// CJS build
esbuild
  .build({
    ...baseConfig,
    outfile: 'dist/index.cjs.js',
    format: 'cjs',
  })
  .then((result) => {
    fs.writeFileSync('dist/meta.cjs.json', JSON.stringify(result.metafile));
    console.log('CJS build complete! ✨');
  })
  .catch(() => process.exit(1));
