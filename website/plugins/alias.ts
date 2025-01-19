import path from "path";

export default function aliasPlugin() {
  return {
    name: 'alias-plugin',
    configureWebpack() {
      return {
        resolve: {
          alias: {
            // Handle different import paths for styled-components
            'styled-components': path.resolve(
              __dirname,
              '../../node_modules/styled-components'
            ),
            // Also handle potential scoped package imports
            '@styled-components/native': path.resolve(
              __dirname,
              '../../node_modules/styled-components'
            ),
            // Handle potential nested styled-components in other dependencies
            '../../node_modules/styled-components': path.resolve(
              __dirname,
              '../../node_modules/styled-components'
            ),
            '@openassistant/common': path.resolve(
              __dirname,
              '../../packages/common/src/index.ts'
            ),
            '@openassistant/keplergl': path.resolve(
              __dirname,
              '../../packages/keplergl/src/index.ts'
            ),
          },
        },
      };
    },
  };
}