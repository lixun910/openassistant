---
layout: home

hero:
  name: 'OpenAssistant'
  text: 'AI Tools for Spatial Data Analysis'
  tagline: A comprehensive toolkit for building AI-powered GIS and spatial data analysis applications
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: View on GitHub
      link: https://github.com/geodaopenjs/openassistant

features:
  - icon: 🗺️
    title: Spatial Analysis Tools
    details: Comprehensive suite of GeoDA tools for spatial statistics, LISA, Moran's I, spatial regression, and more.
  - icon: 🗄️
    title: DuckDB Integration
    details: Powerful in-browser SQL queries with DuckDB WASM for handling large datasets efficiently.
  - icon: 🌍
    title: OpenStreetMap Tools
    details: Access OSM data with geocoding, reverse geocoding, routing, and isochrone analysis.
  - icon: 📊
    title: Visualization Components
    details: Ready-to-use components for ECharts, Vega-Lite, Kepler.gl, and Leaflet visualizations.
  - icon: 📍
    title: Places & H3
    details: Location intelligence with place search, geotagging, and H3 hexagonal spatial indexing.
  - icon: 🤖
    title: AI Framework Agnostic
    details: Works with Vercel AI SDK, LangChain, Anthropic, and other popular AI frameworks.
---

## Quick Start

Install OpenAssistant tools in your project:

```bash
# Install core utilities
npm install @openassistant/utils

# Install specific tools
npm install @openassistant/duckdb
npm install @openassistant/geoda
npm install @openassistant/map
npm install @openassistant/plots

# Install components
npm install @openassistant/chat
npm install @openassistant/echarts
npm install @openassistant/keplergl
```

## Example Usage

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 1fr)); gap: 2rem; align-items: start;">

<div>

```typescript
import { keplergl } from '@openassistant/map';
import { KeplerGlComponent } from '@openassistant/keplergl';
import { convertToVercelAiTool } from '@openassistant/utils';
import { tool } from 'ai';

// Create a kepler map tool with your context
const keplerMapTool = {
  ...keplergl,
  context: {
    getDataset: async (datasetName: string) => {
      if (datasetName in SAMPLE_DATASETS) {
        return SAMPLE_DATASETS[datasetName as keyof typeof SAMPLE_DATASETS];
      }
      throw new Error(`Dataset ${datasetName} not found`);
    },
  },
  component: KeplerGlComponent,
};

// Convert to Vercel AI SDK tool
// const aiTool = tool(convertToVercelAiTool(keplerMapTool));
// Use in your AI application

export function App() {
  return (
    <div className="flex h-screen w-screen items-center justify-center p-4">
      <div className="w-full max-w-[900px] h-full">
        <Assistant
          options={{
            ai: {
              getInstructions:
                () => `You are a helpful assistant that can answer questions and help with tasks.
Your name is George.
You can use the following datasets to answer the user's question:
- Dataset: venues
 - Fields: name, city, ratin
- Dataset: cities
 - Fields: name, population, latitude, longitude
`,
              tools: {
                keplergl: keplerMapTool,
              },
            },
          }}
        />
      </div>
    </div>
  );
}
```

</div>

<div>

![kepler tool screenshot](/kepler-tool-demo-1.gif)

</div>

</div>

## Why OpenAssistant?

OpenAssistant v1.0.0 focuses on providing a rich set of AI tools for spatial data analysis and GIS tasks. Unlike previous versions, v1.0.0 is framework-agnostic and can be integrated with any AI framework of your choice.

### Key Features

- **Browser-First**: Most tools run directly in the browser, ensuring data privacy and reducing server costs
- **Modular Design**: Use only the tools you need, keeping your bundle size minimal
- **TypeScript Native**: Full type safety and excellent IDE support
- **Production Ready**: Battle-tested in real-world applications

## What's New in v1.0.0

Version 1.0.0 represents a major architectural shift:

- **Removed** `@openassistant/ui` - Replaced by `@sqlrooms/ai`
- **Enhanced** All tools now are typed with `OpenAssistantTool` interface
- **Added** Support for multiple AI frameworks (Vercel AI SDK, LangChain, etc.)
- **Improved** Tool output management and data exchange utilities

[Learn more about the v1.0.0 architecture →](/guide/architecture)
