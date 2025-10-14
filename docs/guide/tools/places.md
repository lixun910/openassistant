# Places Tools

The `@openassistant/places` package provides location intelligence with place search and geotagging capabilities using the Foursquare Places API.

## Installation

```bash
npm install @openassistant/places
```

## Available Tools

- **`placeSearch`** - Search for places using Foursquare Places API
- **`geoTagging`** - Add geographic context to text
- **`webSearch`** - Web search with location context

## Basic Usage

### Place Search with Assistant

```typescript
import { placeSearch } from '@openassistant/places';
import { Assistant, type AssistantOptions } from '@openassistant/assistant';
import { ToolCache } from '@openassistant/utils';

const toolResultCache = ToolCache.getInstance();

const placeSearchTool = {
  ...placeSearch,
  context: {
    getFsqToken: () => process.env.FSQ_TOKEN!,
  },
  onToolCompleted: (toolCallId: string, additionalData?: unknown) => {
    // Cache place search results for use with other tools
    toolResultCache.addDataset(toolCallId, additionalData);
  },
};

const config: AssistantOptions = {
  ai: {
    getInstructions: () => `
      You can search for places using the Foursquare Places API.
      Help users find restaurants, coffee shops, hotels, and other points of interest.
    `,
    tools: {
      placeSearch: placeSearchTool,
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

### Usage with Vercel AI SDK

```typescript
import { placeSearch } from '@openassistant/places';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const placeSearchTool = {
  ...placeSearch,
  context: {
    getFsqToken: () => process.env.FSQ_TOKEN!,
  },
};

const result = await generateText({
  model: openai('gpt-4'),
  prompt: 'Find coffee shops near Times Square',
  tools: {
    placeSearch: convertToVercelAiTool(placeSearchTool),
  },
});

console.log(result.text);
```

## Advanced Usage

### Combining with Geocoding

Combine place search with geocoding to search by address:

```typescript
import { placeSearch } from '@openassistant/places';
import { geocoding } from '@openassistant/osm';
import { Assistant } from '@openassistant/assistant';

const config = {
  ai: {
    getInstructions: () => `
      You can search for places and geocode addresses.
      Use geocoding first to get coordinates, then search for places nearby.
    `,
    tools: {
      geocoding: { ...geocoding },
      placeSearch: {
        ...placeSearch,
        context: {
          getFsqToken: () => process.env.FSQ_TOKEN!,
        },
      },
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

### Combining with Map Visualization

```typescript
import { placeSearch } from '@openassistant/places';
import { keplergl } from '@openassistant/map';
import { KeplerGlComponent } from '@openassistant/keplergl';
import { ToolCache } from '@openassistant/utils';
import { Assistant } from '@openassistant/assistant';

const toolResultCache = ToolCache.getInstance();

const placeSearchTool = {
  ...placeSearch,
  context: {
    getFsqToken: () => process.env.FSQ_TOKEN!,
  },
  onToolCompleted: (toolCallId, additionalData) => {
    toolResultCache.addDataset(toolCallId, additionalData);
  },
};

const keplerglTool = {
  ...keplergl,
  context: {
    getDataset: async (datasetName: string) => {
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
      You can search for places and visualize them on a map.
      First search for places, then create a map using the results.
    `,
    tools: {
      placeSearch: placeSearchTool,
      keplergl: keplerglTool,
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

### With Isochrone Filtering

Search for places within a travel time area:

```typescript
import { placeSearch } from '@openassistant/places';
import { isochrone } from '@openassistant/osm';
import { ToolCache } from '@openassistant/utils';
import { Assistant } from '@openassistant/assistant';

const toolResultCache = ToolCache.getInstance();

const isochroneTool = {
  ...isochrone,
  context: {
    getMapboxToken: () => process.env.MAPBOX_TOKEN!,
  },
  onToolCompleted: (toolCallId, additionalData) => {
    toolResultCache.addDataset(toolCallId, additionalData);
  },
};

const placeSearchTool = {
  ...placeSearch,
  context: {
    getFsqToken: () => process.env.FSQ_TOKEN!,
    getGeometries: async (datasetName: string) => {
      // Return isochrone polygon for filtering
      if (toolResultCache.hasDataset(datasetName)) {
        const data = toolResultCache.getDataset(datasetName);
        return [data.content];
      }
      throw new Error(`Dataset ${datasetName} not found`);
    },
  },
};

const config = {
  ai: {
    getInstructions: () => `
      You can search for places within a travel time area.
      First create an isochrone, then search for places within it.
    `,
    tools: {
      isochrone: isochroneTool,
      placeSearch: placeSearchTool,
    },
  },
};
```

## Tool Parameters

### Place Search Parameters

```typescript
{
  query?: string; // Search query (e.g., "coffee", "restaurant")
  
  location?: {
    longitude: number;
    latitude: number;
    radius?: number; // Search radius in meters (0-100000)
  };
  
  near?: string; // Geocodable locality (e.g., "New York, NY")
  
  categories?: string[]; // Array of category IDs
  chains?: string[]; // Array of chain IDs to filter by
  exclude_chains?: string[]; // Array of chain IDs to exclude
  exclude_all_chains?: boolean; // Exclude all chain locations
  
  min_price?: number; // Minimum price range (1-4)
  max_price?: number; // Maximum price range (1-4)
  
  open_now?: boolean; // Only return places currently open
  open_at?: string; // Open at specific time (format: "DOWTHHMM")
  
  limit?: number; // Maximum results (1-50, default: 10)
  sort?: 'relevance' | 'rating' | 'distance'; // Sort order (default: 'relevance')
  
  // Advanced filtering
  ne?: { latitude: number; longitude: number }; // North-east corner for bounds
  sw?: { latitude: number; longitude: number }; // South-west corner for bounds
  isochroneDatasetName?: string; // Dataset name of isochrone polygon
  super_venue_id?: string; // Foursquare Venue ID for search bounds
}
```

## Context Options

```typescript
type FoursquareToolContext = {
  // Required: Get Foursquare API token
  getFsqToken: () => string;
  
  // Optional: Get geometries for polygon filtering (isochrone)
  getGeometries?: (datasetName: string) => Promise<GeoJSON.FeatureCollection[]>;
};
```

## Getting a Foursquare API Token

1. Sign up at [foursquare.com/developers](https://foursquare.com/developers)
2. Create a new project
3. Get your API key
4. Provide it via the `getFsqToken` context method

## Example User Prompts

The AI can respond to prompts like:

- "Find coffee shops near Times Square"
- "Search for restaurants within 2km of the Eiffel Tower"
- "What are the best rated hotels in San Francisco?"
- "Find expensive restaurants in Manhattan that are open now"
- "Show me gas stations within a 10-minute drive from here"
- "Find vegetarian restaurants near me"

## Search Features

### Category Filtering

Search by Foursquare category IDs for specific types of places:

```typescript
// Example: Search for restaurants (category: 13065)
{
  query: "restaurants",
  categories: ["13065"],
  location: { latitude: 40.7589, longitude: -73.9851 }
}
```

### Price Filtering

Filter by price range (1 = most affordable, 4 = most expensive):

```typescript
{
  query: "restaurants",
  location: { latitude: 40.7589, longitude: -73.9851 },
  min_price: 3,
  max_price: 4
}
```

### Opening Hours

Search for places that are currently open or open at specific times:

```typescript
// Currently open
{
  query: "restaurants",
  location: { latitude: 40.7589, longitude: -73.9851 },
  open_now: true
}

// Open on Monday at 9:30 PM
{
  query: "restaurants",
  location: { latitude: 40.7589, longitude: -73.9851 },
  open_at: "1T2130"
}
```

## Response Data

The place search tool returns GeoJSON FeatureCollection with rich place data:

- Basic info: name, address, phone, website
- Categories and chains
- Distance from search center
- Ratings and pricing
- Opening hours
- Photos
- Tips and reviews
- Social media links
- And more...

## Rate Limiting

The place search tool includes built-in rate limiting to comply with Foursquare API usage policies.

## API Reference

For detailed API documentation, see the [Places API Reference](/api/@openassistant/places/README).

## Next Steps

- [OSM Tools](/guide/tools/osm) - Geocoding and routing
- [Map Tools](/guide/tools/map) - Visualize place search results
- [DuckDB Tools](/guide/tools/duckdb) - Query and analyze place data
