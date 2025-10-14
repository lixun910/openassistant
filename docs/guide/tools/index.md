# Tools Overview

OpenAssistant provides a comprehensive suite of AI tools for spatial data analysis and GIS applications. Each tool is designed to be used with AI language models to help users analyze, visualize, and manipulate spatial data.

## Available Tools

### Database Tools

#### DuckDB (@openassistant/duckdb)

Execute SQL queries directly in the browser using DuckDB WASM. Perfect for analyzing large datasets without server infrastructure.

**Key Features:**

- In-browser SQL execution
- Support for complex queries
- Integration with spatial data
- Merge tables functionality

[Learn more →](/guide/tools/duckdb) | [API Reference →](/api/@openassistant/duckdb/README)

### Spatial Analysis Tools

#### GeoDA (@openassistant/geoda)

Comprehensive spatial statistics and analysis tools powered by GeoDa algorithms.

**Key Features:**

- Spatial autocorrelation (Moran's I)
- Local Indicators of Spatial Association (LISA)
- Spatial regression
- Data classification
- Spatial weights creation
- Spatial operations (buffer, dissolve, centroid, etc.)

[Learn more →](/guide/tools/geoda) | [API Reference →](/api/@openassistant/geoda/README)

### Map Tools

#### Map (@openassistant/map)

Tools for creating and manipulating map visualizations with support for Kepler.gl and Leaflet.

**Key Features:**

- Kepler.gl map configuration
- Leaflet map generation
- Data layer management
- Download map data from URLs

[Learn more →](/guide/tools/map) | [API Reference →](/api/@openassistant/map/README)

### Location Services

#### OpenStreetMap (@openassistant/osm)

Access OpenStreetMap data and services including geocoding, routing, and more.

**Key Features:**

- Geocoding and reverse geocoding
- Route calculation
- Isochrone analysis
- US location data (cities, counties, ZIP codes)

[Learn more →](/guide/tools/osm) | [API Reference →](/api/@openassistant/osm/README)

#### Places (@openassistant/places)

Location intelligence with place search and geotagging capabilities using Foursquare Places API.

**Key Features:**

- Place search with rich filtering
- Geotagging
- Web search with location context

[Learn more →](/guide/tools/places) | [API Reference →](/api/@openassistant/places/README)

### Visualization Tools

#### Plots (@openassistant/plots)

Create statistical visualizations using ECharts and Vega-Lite.

**Key Features:**

- Histograms
- Scatter plots with regression
- Box plots
- Bubble charts
- Parallel coordinate plots
- Statistical computations

[Learn more →](/guide/tools/plots) | [API Reference →](/api/@openassistant/plots/README)

### Spatial Indexing

#### H3 (@openassistant/h3)

Hexagonal spatial indexing using Uber's H3 library.

**Key Features:**

- Convert coordinates to H3 indexes
- Hexagonal grid generation
- Spatial aggregation
- Multi-resolution analysis

[Learn more →](/guide/tools/h3) | [API Reference →](/api/@openassistant/h3/README)

## Common Usage Patterns

### Basic Tool Setup

All tools follow a similar pattern based on the user's example:

```typescript
import { toolName } from '@openassistant/package';
import { Assistant, type AssistantOptions } from '@openassistant/assistant';

const myTool = {
  ...toolName,
  context: {
    // Implement required context methods
    // Each tool has specific context requirements
  },
  component: ToolComponent, // Optional: for tools with UI components
};

const config: AssistantOptions = {
  ai: {
    getInstructions: () => `Your assistant instructions here`,
    tools: {
      toolName: myTool,
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

### Usage with Vercel AI SDK

For server-side or custom AI integrations:

```typescript
import { toolName } from '@openassistant/package';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const myTool = {
  ...toolName,
  context: {
    // Implement required context methods
  },
};

const result = await generateText({
  model: openai('gpt-4'),
  prompt: 'Your prompt here',
  tools: {
    toolName: convertToVercelAiTool(myTool),
  },
});
```

### Tool Chaining

Tools can be used together to create complex workflows:

```typescript
import { localQuery } from '@openassistant/duckdb';
import { scatterplot } from '@openassistant/plots';
import { keplergl } from '@openassistant/map';
import { KeplerGlComponent } from '@openassistant/keplergl';
import { ScatterplotComponent } from '@openassistant/echarts';
import { Assistant } from '@openassistant/assistant';

const DATASETS = {
  cities: [
    { name: 'SF', population: 800000, income: 75000, lat: 37.77, lng: -122.42 },
    // ...more cities
  ],
};

const localQueryTool = {
  ...localQuery,
  context: {
    getValues: async (datasetName, variableName) => {
      return DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
};

const scatterplotTool = {
  ...scatterplot,
  context: {
    getValues: async (datasetName, variableName) => {
      return DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
  component: ScatterplotComponent,
};

const keplerglTool = {
  ...keplergl,
  context: {
    getDataset: async (datasetName) => {
      return DATASETS[datasetName];
    },
  },
  component: KeplerGlComponent,
};

const config = {
  ai: {
    getInstructions: () => `
      You are a data analyst assistant.
      Available dataset: cities with fields: name, population, income, lat, lng
    `,
    tools: {
      localQuery: localQueryTool,
      scatterplot: scatterplotTool,
      keplergl: keplerglTool,
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

### Tool Results Caching

Cache tool results for use by other tools:

```typescript
import { downloadMapData, keplergl } from '@openassistant/map';
import { KeplerGlComponent } from '@openassistant/keplergl';
import { ToolCache } from '@openassistant/utils';
import { Assistant } from '@openassistant/assistant';

const toolResultCache = ToolCache.getInstance();

const downloadMapTool = {
  ...downloadMapData,
  onToolCompleted: (toolCallId, additionalData) => {
    // Cache downloaded data for other tools to use
    toolResultCache.addDataset(toolCallId, additionalData);
  },
};

const keplerglTool = {
  ...keplergl,
  context: {
    getDataset: async (datasetName) => {
      // Check cache first
      if (toolResultCache.hasDataset(datasetName)) {
        return toolResultCache.getDataset(datasetName);
      }
      throw new Error(`Dataset ${datasetName} not found`);
    },
  },
  component: KeplerGlComponent,
};

const config = {
  ai: {
    getInstructions: () => `
      You can download map data and create visualizations.
    `,
    tools: {
      downloadMapData: downloadMapTool,
      keplergl: keplerglTool,
    },
  },
};
```

## Tool Categories

### Analysis Tools

Tools that perform computations and analysis:

- **DuckDB** - SQL queries
- **GeoDA** - Spatial statistics
- **H3** - Spatial indexing

### Data Tools

Tools that fetch or manipulate data:

- **OSM** - Location data
- **Places** - Place search
- **Map** - Data download and management

### Visualization Category

Tools that create visual outputs:

- **Plots** - Charts and graphs
- **Map** - Map visualizations (Kepler.gl, Leaflet)

## Context Implementation

Each tool requires specific context methods to be implemented. Here are common patterns:

### Data Access Context

```typescript
// For tools that need variable values (plots, duckdb, geoda)
context: {
  getValues: async (datasetName: string, variableName: string) => {
    return YOUR_DATASETS[datasetName].map((item) => item[variableName]);
  },
}
```

### Geometry Access Context

```typescript
// For tools that need geometries (geoda, h3, map)
context: {
  getGeometries: async (datasetName: string) => {
    return [YOUR_GEOJSON_DATASETS[datasetName]];
  },
}
```

### Dataset Access Context

```typescript
// For tools that need full datasets (map, duckdb)
context: {
  getDataset: async (datasetName: string) => {
    return YOUR_DATASETS[datasetName];
  },
}
```

### API Token Context

```typescript
// For tools that need API keys (places, osm routing/isochrone)
context: {
  getFsqToken: () => process.env.FSQ_TOKEN!,
  // or
  getMapboxToken: () => process.env.MAPBOX_TOKEN!,
}
```

## Performance Tips

1. **Use Tool Caching**: Cache frequently used results with ToolCache
2. **Lazy Loading**: Import tools only when needed
3. **Web Workers**: Most intensive operations already run in WASM
4. **Batch Operations**: Combine multiple queries when possible

```typescript
import { ToolCache } from '@openassistant/utils';

const cache = ToolCache.getInstance();

// Results are cached via onToolCompleted callbacks
const myTool = {
  ...toolName,
  onToolCompleted: (toolCallId, additionalData) => {
    cache.addDataset(toolCallId, additionalData);
  },
};
```

## Complete Example: Comprehensive Analysis App

```typescript
import { localQuery } from '@openassistant/duckdb';
import { dataClassify, spatialWeights, lisa } from '@openassistant/geoda';
import { keplergl } from '@openassistant/map';
import { KeplerGlComponent } from '@openassistant/keplergl';
import { histogram, scatterplot } from '@openassistant/plots';
import { HistogramComponent, ScatterplotComponent } from '@openassistant/echarts';
import { Assistant, type AssistantOptions } from '@openassistant/assistant';
import { ToolCache } from '@openassistant/utils';

const toolResultCache = ToolCache.getInstance();

const DATASETS = {
  neighborhoods: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [[...]] },
        properties: { name: 'Area 1', crime_rate: 45.2, income: 50000 },
      },
      // ...more neighborhoods
    ],
  },
};

const config: AssistantOptions = {
  ai: {
    getInstructions: () => `
      You are a comprehensive data analysis assistant.
      Available dataset: neighborhoods
      Fields: name, crime_rate, income, geometry
      
      You can:
      - Query data with SQL
      - Classify and visualize data
      - Perform spatial analysis
      - Create maps and charts
    `,
    tools: {
      localQuery: {
        ...localQuery,
        context: {
          getValues: async (datasetName, variableName) => {
            return DATASETS[datasetName].features.map((f) => f.properties[variableName]);
          },
        },
      },
      dataClassify: {
        ...dataClassify,
        context: {
          getValues: async (datasetName, variableName) => {
            return DATASETS[datasetName].features.map((f) => f.properties[variableName]);
          },
        },
      },
      spatialWeights: {
        ...spatialWeights,
        context: {
          getGeometries: async (datasetName) => [DATASETS[datasetName]],
        },
        onToolCompleted: (toolCallId, additionalData) => {
          toolResultCache.addDataset(toolCallId, additionalData);
        },
      },
      lisa: {
        ...lisa,
        context: {
          getGeometries: async (datasetName) => [DATASETS[datasetName]],
          getValues: async (datasetName, variableName) => {
            return DATASETS[datasetName].features.map((f) => f.properties[variableName]);
          },
          getWeights: async (weightsId) => {
            return toolResultCache.getDataset(weightsId);
          },
        },
        onToolCompleted: (toolCallId, additionalData) => {
          toolResultCache.addDataset(toolCallId, additionalData);
        },
      },
      keplergl: {
        ...keplergl,
        context: {
          getDataset: async (datasetName) => {
            if (toolResultCache.hasDataset(datasetName)) {
              return toolResultCache.getDataset(datasetName);
            }
            return DATASETS[datasetName];
          },
        },
        component: KeplerGlComponent,
      },
      histogram: {
        ...histogram,
        context: {
          getValues: async (datasetName, variableName) => {
            return DATASETS[datasetName].features.map((f) => f.properties[variableName]);
          },
        },
        component: HistogramComponent,
      },
      scatterplot: {
        ...scatterplot,
        context: {
          getValues: async (datasetName, variableName) => {
            return DATASETS[datasetName].features.map((f) => f.properties[variableName]);
          },
        },
        component: ScatterplotComponent,
      },
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

## Next Steps

Explore individual tool documentation to learn about specific capabilities and usage examples.
