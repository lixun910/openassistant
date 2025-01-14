import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // react: path.resolve(__dirname, "./node_modules/react"),
      '@openassistant/echarts': path.resolve(
        __dirname,
        '../packages/echarts/src/index.ts'
      ),
      '@openassistant/core': path.resolve(
        __dirname,
        '../packages/core/src/index.ts'
      ),
      '@openassistant/geoda': path.resolve(
        __dirname,
        '../packages/geoda/src/index.ts'
      ),
      '@openassistant/ui': path.resolve(
        __dirname,
        '../packages/ui/src/index.ts'
      ),
    };
    return config;
  },
};

export default nextConfig;
