# GeoDA Tools

The `@openassistant/geoda` package provides comprehensive spatial statistics and analysis tools powered by GeoDa algorithms running in WebAssembly.

## Installation

```bash
npm install @openassistant/geoda
```

## Available Tools

### Data Classification

- **`dataClassify`** - Classify numerical data into bins using various statistical methods

### Spatial Statistics

- **`globalMoran`** - Global Moran's I for spatial autocorrelation
- **`lisa`** - Local Indicators of Spatial Association (LISA)

### Spatial Regression

- **`regression`** - OLS and spatial regression models

### Spatial Weights

- **`spatialWeights`** - Create spatial weights matrices (queen, rook, knn, distance-based)

### Spatial Operations

- **`area`** - Calculate areas of polygons
- **`buffer`** - Create buffer zones around features
- **`centroid`** - Calculate centroids of geometries
- **`dissolve`** - Dissolve adjacent polygons
- **`grid`** - Create regular grids
- **`length`** - Calculate lengths of line features
- **`perimeter`** - Calculate perimeters of polygons
- **`thiessenPolygons`** - Generate Thiessen/Voronoi polygons
- **`mst`** - Minimum spanning tree
- **`cartogram`** - Create cartograms

### Spatial Join

- **`spatialJoin`** - Join features based on spatial relationships
- **`spatialFilter`** - Filter features spatially

### Variable Operations

- **`variable`** - Create new variables from existing ones
- **`rate`** - Calculate rates and ratios

## Basic Usage

### Using Data Classification

```typescript
import { dataClassify } from '@openassistant/geoda';
import { Assistant, type AssistantOptions } from '@openassistant/assistant';

const DATASETS = {
  counties: [
    { name: 'County A', population: 100000, income: 50000 },
    { name: 'County B', population: 200000, income: 75000 },
    // ...more counties
  ],
};

const dataClassifyTool = {
  ...dataClassify,
  context: {
    getValues: async (datasetName: string, variableName: string) => {
      return DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
};

const config: AssistantOptions = {
  ai: {
    getInstructions: () => `
      You can classify data using various statistical methods.
      Available dataset: counties with fields: name, population, income
    `,
    tools: {
      dataClassify: dataClassifyTool,
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

### Spatial Weights with Spatial Statistics

```typescript
import { spatialWeights, globalMoran, lisa } from '@openassistant/geoda';
import { Assistant } from '@openassistant/assistant';
import { ToolCache } from '@openassistant/utils';

const toolResultCache = ToolCache.getInstance();

const GEOJSON_DATASETS = {
  neighborhoods: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [[...]] },
        properties: { name: 'Downtown', crime_rate: 45.2 },
      },
      // ...more features
    ],
  },
};

const spatialWeightsTool = {
  ...spatialWeights,
  context: {
    getGeometries: async (datasetName: string) => {
      return [GEOJSON_DATASETS[datasetName]];
    },
  },
  onToolCompleted: (toolCallId, additionalData) => {
    toolResultCache.addDataset(toolCallId, additionalData);
  },
};

const globalMoranTool = {
  ...globalMoran,
  context: {
    getGeometries: async (datasetName: string) => {
      return [GEOJSON_DATASETS[datasetName]];
    },
    getValues: async (datasetName: string, variableName: string) => {
      return GEOJSON_DATASETS[datasetName].features.map(
        (f) => f.properties[variableName]
      );
    },
    getWeights: async (weightsId: string) => {
      if (toolResultCache.hasDataset(weightsId)) {
        return toolResultCache.getDataset(weightsId);
      }
      throw new Error(`Weights ${weightsId} not found`);
    },
  },
};

const lisaTool = {
  ...lisa,
  context: {
    getGeometries: async (datasetName: string) => {
      return [GEOJSON_DATASETS[datasetName]];
    },
    getValues: async (datasetName: string, variableName: string) => {
      return GEOJSON_DATASETS[datasetName].features.map(
        (f) => f.properties[variableName]
      );
    },
    getWeights: async (weightsId: string) => {
      if (toolResultCache.hasDataset(weightsId)) {
        return toolResultCache.getDataset(weightsId);
      }
      throw new Error(`Weights ${weightsId} not found`);
    },
  },
};

const config = {
  ai: {
    getInstructions: () => `
      You can perform spatial analysis on the neighborhoods dataset.
      Steps: 1) Create spatial weights, 2) Run spatial statistics
      Available dataset: neighborhoods with field: crime_rate
    `,
    tools: {
      spatialWeights: spatialWeightsTool,
      globalMoran: globalMoranTool,
      lisa: lisaTool,
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

### Using Spatial Operations

```typescript
import { buffer, centroid, area } from '@openassistant/geoda';
import { Assistant } from '@openassistant/assistant';

const GEOJSON_DATASETS = {
  schools: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-122.4, 37.7] },
        properties: { name: 'School A' },
      },
      // ...more schools
    ],
  },
};

const bufferTool = {
  ...buffer,
  context: {
    getGeometries: async (datasetName: string) => {
      return [GEOJSON_DATASETS[datasetName]];
    },
  },
};

const centroidTool = {
  ...centroid,
  context: {
    getGeometries: async (datasetName: string) => {
      return [GEOJSON_DATASETS[datasetName]];
    },
  },
};

const areaTool = {
  ...area,
  context: {
    getGeometries: async (datasetName: string) => {
      return [GEOJSON_DATASETS[datasetName]];
    },
  },
};

const config = {
  ai: {
    getInstructions: () => `
      You can perform spatial operations on datasets.
      Available dataset: schools (point features)
    `,
    tools: {
      buffer: bufferTool,
      centroid: centroidTool,
      area: areaTool,
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

## Example User Prompts

The AI can respond to prompts like:

- "Classify the income data into 5 classes using natural breaks"
- "Create queen contiguity weights for the neighborhoods dataset"
- "Test for spatial autocorrelation in crime rates"
- "Find crime hotspots using LISA analysis"
- "Create a 500-meter buffer around schools"
- "Calculate the area of each neighborhood"

## Complete Example: Hotspot Analysis

```typescript
import { dataClassify, spatialWeights, lisa } from '@openassistant/geoda';
import { keplergl } from '@openassistant/map';
import { KeplerGlComponent } from '@openassistant/keplergl';
import { ToolCache } from '@openassistant/utils';
import { Assistant, type AssistantOptions } from '@openassistant/assistant';

const toolResultCache = ToolCache.getInstance();

const DATASETS = {
  neighborhoods: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [[...]] },
        properties: { name: 'Area 1', crime_rate: 45.2 },
      },
      // ...more neighborhoods
    ],
  },
};

const dataClassifyTool = {
  ...dataClassify,
  context: {
    getValues: async (datasetName, variableName) => {
      return DATASETS[datasetName].features.map((f) => f.properties[variableName]);
    },
  },
};

const spatialWeightsTool = {
  ...spatialWeights,
  context: {
    getGeometries: async (datasetName) => [DATASETS[datasetName]],
  },
  onToolCompleted: (toolCallId, additionalData) => {
    toolResultCache.addDataset(toolCallId, additionalData);
  },
};

const lisaTool = {
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
};

const keplerglTool = {
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
};

const config: AssistantOptions = {
  ai: {
    getInstructions: () => `
      You can analyze spatial patterns in the neighborhoods dataset.
      Available dataset: neighborhoods with field: crime_rate
      
      For hotspot analysis:
      1. Create spatial weights using queen contiguity
      2. Run LISA analysis on crime_rate
      3. Visualize the results on a map
    `,
    tools: {
      dataClassify: dataClassifyTool,
      spatialWeights: spatialWeightsTool,
      lisa: lisaTool,
      keplergl: keplerglTool,
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

## Performance Considerations

1. **WebAssembly**: All spatial computations run in WASM for optimal performance
2. **Large Datasets**: Consider simplifying geometries for very large datasets
3. **Weights Caching**: Spatial weights can be cached and reused via ToolCache
4. **Browser Environment**: Most tools are designed to run in the browser

## API Reference

For detailed API documentation, see the [GeoDA API Reference](/api/@openassistant/geoda/README).

## Next Steps

- [Map Tools](/guide/tools/map) - Visualize spatial analysis results
- [Plots Tools](/guide/tools/plots) - Create charts from analysis results
- [DuckDB Tools](/guide/tools/duckdb) - Query spatial data with SQL
