const path = require('path');

console.log(path.resolve(__dirname, 'node_modules/react'));

module.exports = {
  eslint: {
    dirs: ['components', 'app'],
  },
  transpilePackages: ['@openassistant/ui', '@openassistant/core'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': './components',
      '@app': './app',
      'styled-components': path.resolve(__dirname, 'node_modules/styled-components'),
      // react: path.resolve(__dirname, 'node_modules/react'),
      // 'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    };

    // Add externals configuration, so Next.js won't bundle them
    // config.externals = [
    //   ...config.externals,
    //   '@loaders.gl/draco',
    //   '@loaders.gl/worker-utils'
    // ];

    return config;
  },
};
