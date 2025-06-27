---
sidebar_position: 2
sidebar_label: OSM Tools
---

# OpenStreetMap Tools

The OpenStreetMap tools for OpenAssistant provides a suite of tools that can invoke OpenStreetMap related APIs e.g. geocoding, calculate routing, fetch OSM roads, generate isochrone etc.

## Features

| Tool Name                                                     | Description                                                                                                      |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [geocoding](/docs/osm/variables/geocoding)                    | converts addresses into geographic coordinates (latitude and longitude) using OpenStreetMap's Nominatim service. |
| [routing](/docs/osm/variables/routing)                        | calculates routes between two points using Mapbox's Directions API                                               |
| [isochrone](/docs/osm/variables/isochrone)                    | generates isochrone polygons showing reachable areas within a given time or distance limit                       |
| [roads](/docs/osm/variables/roads)                            | fetch road networks based on a boundary and road type using OSM Overpass API                                     |
| [queryUSZipcodes](/docs/osm/variables/queryUSZipcodes)        | query US zipcodes within a given map bounds                                                                      |
| [getUsStateGeojson](/docs/osm/variables/getUsStateGeojson)    | get the GeoJSON data of one or more United States states                                                         |
| [getUsCountyGeojson](/docs/osm/variables/getUsCountyGeojson)  | get the GeoJSON data of one or more United States counties                                                       |
| [getUsZipcodeGeojson](/docs/osm/variables/getUsCountyGeojson) | get the GeoJSON data of one or more United States zipcodes                                                       |

## Installation

```bash
npm install @openassistant/osm @openassistant/utils ai
```

## Quick Start

```typescript
import { geocoding, GeocodingTool } from "@openassistant/osm";
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const result = await generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'What are the coordinates of the Eiffel Tower?',
  tools: {
    geocoding: convertToVercelAiTool(geocoding),
  },
});

console.log(result);
```

:::tip
The OpenStreetMap tools can be mixed with other tools for more complex tasks. For example, if you have a point datasets in the US, you can use OSM tool to answer questions like "What are the total revenus in the zipcodes area in Maricopa county?"

The LLM could plan the following steps to answer the question:

1. Get the GeoJSON data of Maricopa county
2. Query the zipcodes in the county
3. Get all zipcode areas (GeoJSON) boundaries
4. Use **spatialJoin** tool to join the zipcode areas with the revenus data
5. Return the total revenus in each zipcode area

:::
