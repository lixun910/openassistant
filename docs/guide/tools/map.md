# Map Tools

The `@openassistant/map` package provides tools for creating and manipulating map visualizations with support for Kepler.gl and Leaflet.

## Installation

```bash
npm install @openassistant/map
```

## Available Tools

### KeplerGLTool

Create and configure Kepler.gl map visualizations.

### LeafletTool

Generate Leaflet map configurations.

### DataLayerTool

Manage data layers on maps.

## Basic Usage

### Kepler.gl Maps

```typescript
import { KeplerGLTool } from '@openassistant/map';
import { tool } from 'ai';

const keplerTool = new KeplerGLTool({
  context: {
    getData: async (datasetName: string) => {
      return await fetchGeoJSON(datasetName);
    },
  },
});

const aiTool = keplerTool.toVercelAiTool(tool);

// Create a map
const result = await keplerTool.execute({
  datasets: ['cities', 'roads'],
  layers: [
    {
      type: 'point',
      datasetId: 'cities',
      config: {
        colorField: 'population',
        colorScale: 'quantile',
        radiusField: 'area'
      }
    },
    {
      type: 'line',
      datasetId: 'roads',
      config: {
        colorField: 'traffic',
        thickness: 2
      }
    }
  ]
});

console.log('Map config:', result.config);
```

### Leaflet Maps

```typescript
import { LeafletTool } from '@openassistant/map';

const leafletTool = new LeafletTool({
  context: {
    getData: async (datasetName) => {
      return await fetchGeoJSON(datasetName);
    },
  },
});

const result = await leafletTool.execute({
  dataset: 'neighborhoods',
  center: [37.7749, -122.4194],
  zoom: 12,
  layers: [
    {
      type: 'choropleth',
      data: 'neighborhoods',
      valueField: 'median_income',
      colorScheme: 'YlOrRd'
    }
  ]
});
```

## API Reference

For detailed API documentation, see the [Map API Reference](/api/@openassistant/map/README).

