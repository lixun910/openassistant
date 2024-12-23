import esbuild from 'esbuild';
import fs from 'fs';
import open from 'open';
import tailwindPlugin from 'esbuild-plugin-tailwindcss';

const isStart = process.argv.includes('--start');
const port = 3001;

// Updated base config with new options
const baseConfig = {
  entryPoints: ['src/main.tsx'],
  bundle: true,
  minify: !isStart,
  sourcemap: isStart,
  metafile: true,
  target: ['chrome58', 'firefox57', 'safari11'],
  loader: {
    '.js': 'jsx',
    '.ts': 'tsx',
    '.png': 'file',
    '.jpg': 'file',
    '.svg': 'file',
    '.css': 'css',
  },
  define: {
    'process.env.NODE_ENV': isStart ? '"development"' : '"production"',
  },
  jsx: 'automatic',
  plugins: [
    tailwindPlugin({
      config: './tailwind.config.js',
    }),
  ],
  external: ['react', 'react-dom', '@langchain', 'html2canvas'],
  format: 'esm',
  platform: 'browser',
  alias: {
    '@openassistant/core': '../core/src/index.ts',
  },
};

const openURL = (url) => {
  open(url).catch(() => {
    console.log(`Unable to open browser. Please visit ${url} manually.`);
  });
};

if (isStart) {
  // Development server with hot reload
  esbuild
    .context({
      ...baseConfig,
      outdir: 'build',
      minify: false,
      sourcemap: true,
      // we need all the dependencies to develop locally
      external: [],
      banner: {
        js: `new EventSource('/esbuild').addEventListener('change', () => location.reload());`,
      },
    })
    .then(async (ctx) => {
      await ctx.watch();
      await ctx.serve({
        servedir: 'build',
        port,
        fallback: 'build/index.html',
        onRequest: ({ remoteAddress, method, path, status, timeInMS }) => {
          console.info(
            remoteAddress,
            status,
            `"${method} ${path}" [${timeInMS}ms]`
          );
        },
      });
      console.info(
        `Development server running at http://localhost:${port}, press Ctrl+C to stop`
      );
      openURL(`http://localhost:${port}`);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
} else {
  // Single CJS build for main distribution
  esbuild
    .build({
      ...baseConfig,
      outfile: 'dist/index.cjs.js',
      format: 'cjs',
    })
    .then((result) => {
      fs.writeFileSync('dist/meta.cjs.json', JSON.stringify(result.metafile));
      console.log('CJS Build complete! ✨');
    })
    .catch(() => process.exit(1));

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

  // IIFE build
  esbuild
    .build({
      ...baseConfig,
      outfile: 'dist/index.iife.js',
      format: 'iife',
    })
    .then((result) => {
      fs.writeFileSync('dist/meta.iife.json', JSON.stringify(result.metafile));
      console.log('IIFE build complete! ✨');
    })
    .catch(() => process.exit(1));
}
