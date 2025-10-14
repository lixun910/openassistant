# OpenStreetMap Tools

The `@openassistant/osm` package provides tools for accessing OpenStreetMap data and services including geocoding, routing, and US location data.

## Installation

```bash
npm install @openassistant/osm
```

## Available Tools

### Location Services

- **`geocoding`** - Convert addresses to coordinates
- **`reverseGeocoding`** - Convert coordinates to addresses
- **`routing`** - Calculate routes between points
- **`isochrone`** - Generate isochrone (travel time) polygons
- **`roads`** - Get road network information

### US Location Data

- **`queryUSCity`** - Search US cities
- **`queryUSCounty`** - Search US counties
- **`queryUSState`** - Query US states
- **`queryZipcode`** - Query US ZIP codes

## Basic Usage

### Geocoding

Convert an address to geographic coordinates:

```typescript
import { geocoding } from '@openassistant/osm';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const geocodingTool = {
  ...geocoding,
};

const result = await generateText({
  model: openai('gpt-4'),
  prompt: 'What are the coordinates of the Eiffel Tower?',
  tools: {
    geocoding: convertToVercelAiTool(geocodingTool),
  },
});

console.log(result.text);
```

### Usage with Assistant

```typescript
import { geocoding, routing, isochrone } from '@openassistant/osm';
import { Assistant, type AssistantOptions } from '@openassistant/assistant';

const config: AssistantOptions = {
  ai: {
    getInstructions: () => `
      You are a helpful assistant with access to location services.
      You can geocode addresses, calculate routes, and generate isochrones.
    `,
    tools: {
      geocoding: { ...geocoding },
      routing: {
        ...routing,
        context: {
          getMapboxToken: () => process.env.MAPBOX_TOKEN!,
        },
      },
      isochrone: {
        ...isochrone,
        context: {
          getMapboxToken: () => process.env.MAPBOX_TOKEN!,
        },
      },
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

### Routing

Calculate routes between two points:

```typescript
import { routing } from '@openassistant/osm';
import { convertToVercelAiTool } from '@openassistant/utils';
import { Assistant } from '@openassistant/assistant';

const routingTool = {
  ...routing,
  context: {
    getMapboxToken: () => process.env.MAPBOX_TOKEN!,
  },
};

const config = {
  ai: {
    getInstructions: () => `You can calculate routes between locations.`,
    tools: {
      routing: routingTool,
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

### Isochrone Generation

Generate travel time polygons:

```typescript
import { isochrone } from '@openassistant/osm';
import { IsochroneComponent } from '@openassistant/leaflet';
import { Assistant } from '@openassistant/assistant';

const isochroneTool = {
  ...isochrone,
  context: {
    getMapboxToken: () => process.env.MAPBOX_TOKEN!,
  },
  component: IsochroneComponent,
};

const config = {
  ai: {
    getInstructions: () => `
      You can generate isochrone maps showing travel time from locations.
    `,
    tools: {
      isochrone: isochroneTool,
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

### US Location Queries

Query US cities, counties, states, and ZIP codes:

```typescript
import { queryUSCity, queryUSCounty, queryUSState, queryZipcode } from '@openassistant/osm';
import { Assistant } from '@openassistant/assistant';

const config = {
  ai: {
    getInstructions: () => `
      You can query US location data including cities, counties, states, and ZIP codes.
    `,
    tools: {
      queryUSCity: { ...queryUSCity },
      queryUSCounty: { ...queryUSCounty },
      queryUSState: { ...queryUSState },
      queryZipcode: { ...queryZipcode },
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

## Tool Parameters

### Geocoding Parameters

```typescript
{
  address: string; // The address to geocode
}
```

### Reverse Geocoding Parameters

```typescript
{
  latitude: number;
  longitude: number;
}
```

### Routing Parameters

```typescript
{
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  mode?: 'driving' | 'walking' | 'cycling'; // Default: 'driving'
}
```

### Isochrone Parameters

```typescript
{
  location: {
    latitude: number;
    longitude: number;
  };
  mode: 'driving' | 'walking' | 'cycling';
  contours: number[]; // Travel times in minutes (e.g., [5, 10, 15])
}
```

### US City Query Parameters

```typescript
{
  cityName?: string;
  stateName?: string;
  stateCode?: string;
  limit?: number; // Default: 10
}
```

## Context Options

### Mapbox Tools (routing, isochrone)

These tools require a Mapbox API token:

```typescript
type MapboxToolContext = {
  getMapboxToken: () => string;
};
```

To get a Mapbox token:

1. Sign up at [mapbox.com](https://www.mapbox.com/)
2. Create an access token
3. Provide it via the context

### OpenStreetMap Tools (geocoding, reverseGeocoding)

These tools use the free Nominatim service and don't require authentication. They include built-in rate limiting to comply with usage policies.

## Example User Prompts

The AI can respond to prompts like:

- "What are the coordinates of 123 Main Street, New York?"
- "Find the route from San Francisco to Los Angeles"
- "Show me a 15-minute walking isochrone from Times Square"
- "What cities are in California with population over 100,000?"
- "What is the address of coordinates 37.7749, -122.4194?"
- "Find ZIP codes near 94102"

## Rate Limiting

The OSM tools include built-in rate limiting to comply with service usage policies:

- **Nominatim (geocoding, reverse geocoding)**: 1 request per second
- **Mapbox (routing, isochrone)**: Configured based on your plan

## Complete Example

```typescript
import { geocoding, routing, isochrone, queryUSCity } from '@openassistant/osm';
import { IsochroneComponent } from '@openassistant/leaflet';
import { Assistant, type AssistantOptions } from '@openassistant/assistant';

const config: AssistantOptions = {
  ai: {
    getInstructions: () => `
      You are a helpful location assistant.
      You can:
      - Geocode addresses
      - Calculate routes
      - Generate travel time maps
      - Query US location data
    `,
    tools: {
      geocoding: { ...geocoding },
      routing: {
        ...routing,
        context: {
          getMapboxToken: () => process.env.MAPBOX_TOKEN!,
        },
      },
      isochrone: {
        ...isochrone,
        context: {
          getMapboxToken: () => process.env.MAPBOX_TOKEN!,
        },
        component: IsochroneComponent,
      },
      queryUSCity: { ...queryUSCity },
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

## Data Caching

Results from OSM tools can be cached for use with other tools:

```typescript
import { geocoding } from '@openassistant/osm';
import { keplergl } from '@openassistant/map';
import { ToolCache } from '@openassistant/utils';

const toolResultCache = ToolCache.getInstance();

const geocodingTool = {
  ...geocoding,
  onToolCompleted: (toolCallId: string, additionalData?: unknown) => {
    // Cache geocoding results
    toolResultCache.addDataset(toolCallId, additionalData);
  },
};

const keplerglTool = {
  ...keplergl,
  context: {
    getDataset: async (datasetName: string) => {
      // Use cached geocoding results
      if (toolResultCache.hasDataset(datasetName)) {
        return toolResultCache.getDataset(datasetName);
      }
      throw new Error(`Dataset ${datasetName} not found`);
    },
  },
};
```

## API Reference

For detailed API documentation, see the [OSM API Reference](/api/@openassistant/osm/README).

## Next Steps

- [Map Tools](/guide/tools/map) - Visualize routes and isochrones
- [Places Tools](/guide/tools/places) - Search for places of interest
- [GeoDA Tools](/guide/tools/geoda) - Spatial analysis
