/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@openassistant/echarts": path.resolve(__dirname, "../packages/echarts/src/index.ts"),
      "@openassistant/core": path.resolve(__dirname, "../packages/core/src/index.ts"),
    };
    return config;
  },
};

export default nextConfig;
