# OpenStreetMap Tools

The `@openassistant/osm` package provides tools for accessing OpenStreetMap data and services.

## Installation

```bash
npm install @openassistant/osm
```

## Available Tools

- **GeocodingTool** - Convert addresses to coordinates
- **ReverseGeocodingTool** - Convert coordinates to addresses
- **RoutingTool** - Calculate routes between points
- **IsochroneTool** - Generate isochrone maps
- **USCityTool** - Search US cities
- **USCountyTool** - Search US counties
- **USZipCodeTool** - Query US ZIP codes

## Basic Usage

### Geocoding

```typescript
import { GeocodingTool } from '@openassistant/osm';

const geocodingTool = new GeocodingTool();

const result = await geocodingTool.execute({
  address: '1600 Amphitheatre Parkway, Mountain View, CA'
});

console.log('Coordinates:', result.lat, result.lon);
```

### Routing

```typescript
import { RoutingTool } from '@openassistant/osm';

const routingTool = new RoutingTool();

const result = await routingTool.execute({
  origin: [37.7749, -122.4194],
  destination: [37.3352, -121.8811],
  mode: 'driving'
});

console.log('Distance:', result.distance);
console.log('Duration:', result.duration);
console.log('Route:', result.geometry);
```

## API Reference

For detailed API documentation, see the [OSM API Reference](/api/@openassistant/osm/README).

