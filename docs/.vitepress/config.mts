import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'OpenAssistant',
  description: 'AI Tools for Spatial Data Analysis and GIS',
  base: '/openassistant/',
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { 
        text: 'API Reference', 
        items: [
          {
            text: 'Tools',
            items: [
              { text: 'DuckDB', link: '/api/@openassistant/duckdb/README' },
              { text: 'GeoDA', link: '/api/@openassistant/geoda/README' },
              { text: 'H3', link: '/api/@openassistant/h3/README' },
              { text: 'Map', link: '/api/@openassistant/map/README' },
              { text: 'OSM', link: '/api/@openassistant/osm/README' },
              { text: 'Places', link: '/api/@openassistant/places/README' },
              { text: 'Plots', link: '/api/@openassistant/plots/README' }
            ]
          },
          {
            text: 'Components',
            items: [
              { text: 'Chat', link: '/api/@openassistant/chat/README' },
              { text: 'Common', link: '/api/@openassistant/common/README' },
              { text: 'ECharts', link: '/api/@openassistant/echarts/README' },
              { text: 'Hooks', link: '/api/@openassistant/hooks/README' },
              { text: 'Kepler.gl', link: '/api/@openassistant/keplergl/README' },
              { text: 'Leaflet', link: '/api/@openassistant/leaflet/README' },
              { text: 'Tables', link: '/api/@openassistant/tables/README' },
              { text: 'Vega-Lite', link: '/api/@openassistant/vegalite/README' }
            ]
          },
          {
            text: 'Utils',
            items: [
              { text: 'Utils', link: '/api/@openassistant/utils/README' }
            ]
          }
        ]
      },
      { text: 'Blog', link: '/blog/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is OpenAssistant?', link: '/guide/' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Architecture', link: '/guide/architecture' }
          ]
        },
        {
          text: 'Tools',
          items: [
            { text: 'Overview', link: '/guide/tools/' },
            { text: 'DuckDB Tools', link: '/guide/tools/duckdb' },
            { text: 'GeoDA Tools', link: '/guide/tools/geoda' },
            { text: 'Map Tools', link: '/guide/tools/map' },
            { text: 'OSM Tools', link: '/guide/tools/osm' },
            { text: 'Places Tools', link: '/guide/tools/places' },
            { text: 'Plots Tools', link: '/guide/tools/plots' },
            { text: 'H3 Tools', link: '/guide/tools/h3' }
          ]
        },
        {
          text: 'Components',
          items: [
            { text: 'Overview', link: '/guide/components/' },
            { text: 'Chat Component', link: '/guide/components/chat' },
            { text: 'Visualization Components', link: '/guide/components/visualization' }
          ]
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Creating Custom Tools', link: '/guide/advanced/custom-tools' },
            { text: 'Integration with AI SDK', link: '/guide/advanced/ai-sdk-integration' }
          ]
        }
      ],
      '/blog/': [
        {
          text: 'Blog',
          items: [
            { text: 'All Posts', link: '/blog/' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/geodaopenjs/openassistant' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Xun Li'
    }
  }
});

