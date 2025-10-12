# What is OpenAssistant?

OpenAssistant is a comprehensive toolkit for building AI-powered spatial data analysis and GIS applications. It provides a rich set of tools that can be integrated with popular AI frameworks like Vercel AI SDK, LangChain, and Anthropic.

## Philosophy

OpenAssistant v1.0.0 is built on three core principles:

1. **Browser-First**: All tools run directly in the browser using WebAssembly and modern web technologies, ensuring data privacy and eliminating the need for backend infrastructure.

2. **Framework Agnostic**: Tools can be easily converted to work with any AI framework through a simple adapter pattern.

3. **Modular Architecture**: Use only what you need. Each tool is published as a separate package, allowing you to keep your bundle size minimal.

## Architecture Overview

OpenAssistant v1.0.0 consists of three main categories of packages:

### Tools

AI-powered tools for spatial analysis and data processing:

- **@openassistant/duckdb** - SQL query execution in the browser
- **@openassistant/geoda** - Spatial statistics and analysis
- **@openassistant/map** - Map data manipulation and visualization tools
- **@openassistant/osm** - OpenStreetMap data access and routing
- **@openassistant/places** - Location search and geotagging
- **@openassistant/plots** - Statistical visualizations
- **@openassistant/h3** - Hexagonal spatial indexing

### Components

React components for visualization and UI:

- **@openassistant/chat** - Chat interface components
- **@openassistant/echarts** - ECharts visualization components
- **@openassistant/keplergl** - Kepler.gl map components
- **@openassistant/leaflet** - Leaflet map components
- **@openassistant/vegalite** - Vega-Lite chart components
- **@openassistant/tables** - Data table components
- **@openassistant/hooks** - Reusable React hooks
- **@openassistant/common** - Common UI utilities

### Utils

Utility functions for tool management and data exchange:

- **@openassistant/utils** - Tool cache, output management, and conversion utilities

## Use Cases

OpenAssistant is ideal for:

- **Spatial Data Analysis**: Perform complex spatial statistics and analysis in the browser
- **GIS Applications**: Build interactive mapping applications with AI assistance
- **Data Exploration**: Let AI help users explore and analyze their spatial datasets
- **Location Intelligence**: Integrate location-based services into your applications
- **Business Intelligence**: Create AI-powered dashboards with spatial data visualizations

## Next Steps

- [Getting Started](/guide/getting-started) - Set up your first OpenAssistant project
- [Architecture Deep Dive](/guide/architecture) - Learn about the internal architecture
- [Tools Overview](/guide/tools/) - Explore available tools
- [API Reference](/api/@openassistant/duckdb/README) - Browse the complete API documentation

