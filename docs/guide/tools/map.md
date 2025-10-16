# Map Tools

The `@openassistant/map` package provides tools for creating and manipulating map visualizations with support for Kepler.gl and Leaflet.

## Installation

```bash
npm install @openassistant/map
```

## Available Tools

### `keplergl`

Create and configure Kepler.gl map visualizations from datasets.

### `leaflet`

Generate Leaflet map configurations from GeoJSON data.

### `downloadMapData`

Download map data (GeoJSON or CSV) from a URL for use with other map tools.

## Basic Usage

### Kepler.gl Maps with Assistant

```typescript
import { keplergl } from '@openassistant/map';
import { KeplerGlComponent } from '@openassistant/keplergl';
import { Assistant, type AssistantOptions } from '@openassistant/assistant';

// Sample dataset
const SAMPLE_DATASETS = {
  cities: [
    { name: 'San Francisco', population: 800000, latitude: 37.774929, longitude: -122.419416 },
    { name: 'New York', population: 8400000, latitude: 40.712776, longitude: -74.005974 },
    { name: 'Los Angeles', population: 3900000, latitude: 34.052235, longitude: -118.243683 },
  ],
};

const keplerMapTool = {
  ...keplergl,
  context: {
    getDataset: async (datasetName: string) => {
      if (datasetName in SAMPLE_DATASETS) {
        return SAMPLE_DATASETS[datasetName];
      }
      throw new Error(`Dataset ${datasetName} not found`);
    },
  },
  component: KeplerGlComponent,
};

const config: AssistantOptions = {
  ai: {
    getInstructions: () => `
      You are a helpful assistant. 
      You can use the following datasets:
      - Dataset: cities
        Fields: name, population, latitude, longitude
    `,
    tools: {
      keplergl: keplerMapTool,
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

## Leaflet Maps

```typescript
import { leaflet } from '@openassistant/map';
import { LeafletComponent } from '@openassistant/leaflet';
import { Assistant } from '@openassistant/assistant';

const leafletTool = {
  ...leaflet,
  context: {
    getDataset: async (datasetName: string) => {
      // Return GeoJSON FeatureCollection
      return YOUR_GEOJSON_DATASETS[datasetName];
    },
  },
  component: LeafletComponent,
};

const config = {
  ai: {
    getInstructions: () => `You can create Leaflet maps from GeoJSON data`,
    tools: {
      leaflet: leafletTool,
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

## Downloading Map Data

The `downloadMapData` tool allows you to download GeoJSON or CSV files from URLs and use them with other map tools.

```typescript
import { downloadMapData, keplergl } from '@openassistant/map';
import { KeplerGlComponent } from '@openassistant/keplergl';
import { convertToVercelAiTool, ToolCache } from '@openassistant/utils';
import { Assistant } from '@openassistant/assistant';

// Cache for downloaded datasets
const toolResultCache = ToolCache.getInstance();

const downloadMapTool = {
  ...downloadMapData,
  onToolCompleted: (toolCallId: string, additionalData?: unknown) => {
    // Cache the downloaded dataset
    toolResultCache.addDataset(toolCallId, additionalData);
  },
};

const keplerglTool = {
  ...keplergl,
  context: {
    getDataset: async (datasetName: string) => {
      // Check if dataset was downloaded
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
    getInstructions: () => `You can download map data from URLs and create maps.`,
    tools: {
      keplergl: keplerglTool,
      downloadMapData: downloadMapTool,
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

## Advanced Usage

### Colored Maps with Data Classification

Kepler.gl and Leaflet tools support color visualization based on data classification:

```typescript
import { keplergl } from '@openassistant/map';
import { dataClassify } from '@openassistant/geoda';
import { KeplerGlComponent } from '@openassistant/keplergl';
import { Assistant } from '@openassistant/assistant';

const DATASETS = {
  neighborhoods: [
    { name: 'Downtown', income: 75000, latitude: 37.7749, longitude: -122.4194, _geojson: {...} },
    { name: 'Mission', income: 55000, latitude: 37.7599, longitude: -122.4148, _geojson: {...} },
    // ...more neighborhoods
  ],
};

const keplerglTool = {
  ...keplergl,
  context: {
    getDataset: async (datasetName: string) => {
      return DATASETS[datasetName];
    },
  },
  component: KeplerGlComponent,
};

const dataClassifyTool = {
  ...dataClassify,
  context: {
    getValues: async (datasetName: string, variableName: string) => {
      return DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
};

const config = {
  ai: {
    getInstructions: () => `
      You can create maps with color visualization.
      Use dataClassify to classify data before creating colored maps.
    `,
    tools: {
      keplergl: keplerglTool,
      dataClassify: dataClassifyTool,
    },
  },
};
```

### Supported Map Types

Kepler.gl supports the following map types:

- **point**: Point markers on the map
- **line**: Line connections between points
- **arc**: Curved lines between points
- **geojson**: GeoJSON polygons, lines, or points

### Context Options

#### Kepler.gl Context

```typescript
type MapToolContext = {
  // Required: Get dataset by name
  getDataset?: (datasetName: string) => Promise<unknown>;
  
  // Optional: Get geometries from previous tool results
  getGeometries?: (datasetName: string) => Promise<GeoJSON.FeatureCollection[]>;
};
```

#### Leaflet Context

```typescript
type MapToolContext = {
  // Required: Get GeoJSON dataset
  getDataset?: (datasetName: string) => Promise<GeoJSON.FeatureCollection>;
  
  // Optional: Get geometries from previous tool results
  getGeometries?: (datasetName: string) => Promise<GeoJSON.FeatureCollection[]>;
};
```

## Example User Prompts

The AI can respond to natural language prompts like:

- "Create a point map of cities showing their population"
- "Make a map from <https://example.com/data.geojson>"
- "Show neighborhoods colored by median income"
- "Create an arc map showing flight connections"

## Data Format Support

### Kepler.gl Data Formats

- Array of objects (e.g., `[{name: 'City', lat: 37.7, lng: -122.4}]`)
- Apache Arrow Table
- GeoJSON FeatureCollection
- CSV data (via downloadMapData tool)

### Leaflet Data Format

- GeoJSON FeatureCollection only

## API Reference

For detailed API documentation, see the [Map API Reference](/api/@openassistant/map/README).

## Next Steps

- [GeoDA Tools](/guide/tools/geoda) - Use data classification for colored maps
- [DuckDB Tools](/guide/tools/duckdb) - Query data before mapping
- [OSM Tools](/guide/tools/osm) - Get location data for mapping
