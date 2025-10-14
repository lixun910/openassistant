# GeoDA Tools

The `@openassistant/geoda` package provides comprehensive spatial statistics and analysis tools powered by GeoDa algorithms running in WebAssembly.

## Installation

```bash
npm install @openassistant/geoda
```

## Available Tools

### Spatial Statistics

- **GlobalMoranTool** - Global Moran's I for spatial autocorrelation
- **LISATool** - Local Indicators of Spatial Association
- **GetisOrdTool** - Getis-Ord G and G* statistics

### Spatial Regression

- **RegressionTool** - OLS and spatial regression models

### Data Classification

- **ClassifyTool** - Various classification methods (quantiles, natural breaks, etc.)

### Spatial Weights

- **WeightsTool** - Create spatial weights matrices
- **Queen/Rook** - Contiguity-based weights
- **Distance** - Distance-based weights
- **K-Nearest Neighbors** - KNN weights

### Spatial Operations

- **BufferTool** - Create buffer zones
- **DissolveTool** - Dissolve polygons
- **CentroidTool** - Calculate centroids
- **AreaTool** - Calculate areas
- **PerimeterTool** - Calculate perimeters
- **CartogramTool** - Create cartograms
- **ThiessenTool** - Generate Thiessen polygons
- **GridTool** - Create regular grids

### Spatial Join

- **SpatialJoinTool** - Join features based on spatial relationships
- **SpatialFilterTool** - Filter features spatially

## Basic Usage

### Global Moran's I

Test for spatial autocorrelation across the entire study area:

```typescript
import { GlobalMoranTool } from '@openassistant/geoda';
import { tool } from 'ai';

const moranTool = new GlobalMoranTool({
  context: {
    getData: async (datasetName: string) => {
      return await fetchGeoJSON(datasetName);
    },
  },
});

const aiTool = moranTool.toVercelAiTool(tool);

// Execute
const result = await moranTool.execute({
  dataset: 'counties',
  variable: 'income',
  weightsType: 'queen',
  permutations: 999
});

console.log('Moran I:', result.moran_i);
console.log('P-value:', result.p_value);
```

### LISA Analysis

Identify local clusters and spatial outliers:

```typescript
import { LISATool } from '@openassistant/geoda';

const lisaTool = new LISATool({
  context: {
    getData: async (datasetName) => {
      return await fetchGeoJSON(datasetName);
    },
  },
});

const result = await lisaTool.execute({
  dataset: 'neighborhoods',
  variable: 'crime_rate',
  weightsType: 'queen',
  significance: 0.05
});

// Results include cluster types: HH, LL, HL, LH, Not Significant
console.log('Clusters:', result.clusters);
console.log('P-values:', result.p_values);
```

### Spatial Regression

Run spatial regression models:

```typescript
import { RegressionTool } from '@openassistant/geoda';

const regressionTool = new RegressionTool({
  context: {
    getData: async (datasetName) => {
      return await fetchGeoJSON(datasetName);
    },
  },
});

const result = await regressionTool.execute({
  dataset: 'cities',
  dependent: 'housing_price',
  independent: ['income', 'population', 'distance_to_cbd'],
  modelType: 'spatial_lag',
  weightsType: 'knn',
  k: 8
});

console.log('Coefficients:', result.coefficients);
console.log('R-squared:', result.r_squared);
console.log('AIC:', result.aic);
```

## Spatial Operations

### Buffer Analysis

Create buffer zones around features:

```typescript
import { BufferTool } from '@openassistant/geoda';

const bufferTool = new BufferTool({
  context: {
    getData: async (datasetName) => {
      return await fetchGeoJSON(datasetName);
    },
  },
});

const result = await bufferTool.execute({
  dataset: 'schools',
  distance: 500, // meters
  unit: 'meters'
});

// Returns buffered GeoJSON
console.log('Buffered features:', result.features);
```

### Spatial Join

Join features based on spatial relationships:

```typescript
import { SpatialJoinTool } from '@openassistant/geoda';

const joinTool = new SpatialJoinTool({
  context: {
    getData: async (datasetName) => {
      return await fetchGeoJSON(datasetName);
    },
  },
});

const result = await joinTool.execute({
  targetDataset: 'neighborhoods',
  joinDataset: 'crimes',
  joinType: 'intersects',
  aggregation: 'count'
});

// Neighborhoods with crime counts
console.log('Joined features:', result.features);
```

## Data Classification

Classify data into bins using various methods:

```typescript
import { ClassifyTool } from '@openassistant/geoda';

const classifyTool = new ClassifyTool({
  context: {
    getData: async (datasetName) => {
      return await fetchGeoJSON(datasetName);
    },
  },
});

const result = await classifyTool.execute({
  dataset: 'counties',
  variable: 'population',
  method: 'natural_breaks', // or 'quantile', 'equal_interval', 'std_dev'
  numClasses: 5
});

console.log('Breaks:', result.breaks);
console.log('Classifications:', result.classifications);
```

## Spatial Weights

### Creating Weights Matrices

```typescript
import { WeightsTool } from '@openassistant/geoda';

const weightsTool = new WeightsTool({
  context: {
    getData: async (datasetName) => {
      return await fetchGeoJSON(datasetName);
    },
  },
});

// Queen contiguity
const queenWeights = await weightsTool.execute({
  dataset: 'counties',
  type: 'queen',
  order: 1
});

// K-nearest neighbors
const knnWeights = await weightsTool.execute({
  dataset: 'points',
  type: 'knn',
  k: 8
});

// Distance-based
const distWeights = await weightsTool.execute({
  dataset: 'cities',
  type: 'distance',
  threshold: 100000, // meters
  distanceMetric: 'euclidean'
});
```

## Working with GeoJSON

All GeoDA tools expect GeoJSON format:

```typescript
// Your GeoJSON data
const geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[[lng, lat], ...]]
      },
      properties: {
        id: 1,
        population: 100000,
        income: 50000,
        // ... other attributes
      }
    },
    // ... more features
  ]
};
```

## Performance Considerations

1. **WebAssembly**: Computation runs in WASM for optimal performance
2. **Large Datasets**: Consider simplifying geometries for very large datasets
3. **Weights Caching**: Spatial weights can be cached and reused
4. **Progressive Results**: Some tools support streaming results

```typescript
import { ToolCache } from '@openassistant/utils';

const cache = new ToolCache();

// Cache weights matrix
const weights = await cache.getOrCompute('weights-counties-queen', async () => {
  return await weightsTool.execute({
    dataset: 'counties',
    type: 'queen'
  });
});
```

## Complete Example: Hotspot Analysis

```typescript
import { LISATool, ClassifyTool } from '@openassistant/geoda';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { tool } from 'ai';

// Set up LISA tool
const lisaTool = new LISATool({
  context: {
    getData: async (datasetName) => {
      const response = await fetch(`/api/data/${datasetName}`);
      return response.json();
    },
  },
});

// Use with AI to analyze crime hotspots
const result = await generateText({
  model: openai('gpt-4'),
  tools: {
    lisa_analysis: lisaTool.toVercelAiTool(tool),
  },
  prompt: `
    Analyze the crime_data dataset to identify crime hotspots.
    Use LISA analysis on the 'crime_rate' variable.
    Tell me where the high-high clusters are located.
  `,
});

console.log(result.text);
```

## API Reference

For detailed API documentation, see the [GeoDA API Reference](/api/@openassistant/geoda/README).

## Next Steps

- [Map Tools](/guide/tools/map) - Visualize spatial analysis results
- [Plots Tools](/guide/tools/plots) - Create charts from analysis results
- [DuckDB Tools](/guide/tools/duckdb) - Query spatial data with SQL

