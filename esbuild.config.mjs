import esbuild from 'esbuild';
import fs from 'fs';
import open from 'open';
import tailwindPlugin from 'esbuild-plugin-tailwindcss';

// Shared utilities
export const openURL = (url) => {
  open(url).catch(() => {
    console.log(`Unable to open browser. Please visit ${url} manually.`);
  });
};

// Create base configuration factory
export const createBaseConfig = (options = {}) => {
  const isStart = process.argv.includes('--start');
  
  return {
    bundle: true,
    minify: !isStart,
    sourcemap: isStart,
    metafile: true,
    target: ['chrome58', 'firefox57', 'safari11'],
    format: 'esm',
    platform: 'browser',
    define: {
      'process.env.NODE_ENV': isStart ? '"development"' : '"production"',
    },
    ...options,
  };
};

// Development server configuration factory
export const createDevServer = (config, port = 3001) => {
  return esbuild
    .context({
      ...config,
      outdir: 'build',
      minify: false,
      sourcemap: true,
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
    });
};

// Build function for different formats
export const buildFormat = async (config, format, outfile) => {
  const result = await esbuild.build({
    ...config,
    format,
    ...(outfile ? { outfile } : {}),
  });

  const metaFile = outfile ? outfile.replace('.js', '.meta.json') : 'dist/meta.json';
  fs.writeFileSync(metaFile, JSON.stringify(result.metafile));
  console.log(`${format.toUpperCase()} build complete! ✨`);
  
  return result;
}; 