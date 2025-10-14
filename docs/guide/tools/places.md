# Places Tools

The `@openassistant/places` package provides location intelligence with place search and geotagging capabilities.

## Installation

```bash
npm install @openassistant/places
```

## Available Tools

- **PlaceSearchTool** - Search for places
- **GeoTaggingTool** - Add geographic context to text
- **WebSearchTool** - Web search with location context

## Basic Usage

```typescript
import { PlaceSearchTool } from '@openassistant/places';

const placeSearchTool = new PlaceSearchTool({
  apiKey: process.env.PLACES_API_KEY
});

const result = await placeSearchTool.execute({
  query: 'coffee shops',
  location: [37.7749, -122.4194],
  radius: 1000
});

console.log('Places:', result.places);
```

## API Reference

For detailed API documentation, see the [Places API Reference](/api/@openassistant/places/README).

