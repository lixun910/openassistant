---
sidebar_position: 1
sidebar_label: Map Tools
---

# @openassistant/map

The map tools for OpenAssistant provides powerful mapping capabilities using [Kepler.gl](https://kepler.gl/) and [Leaflet](https://leafletjs.com/).

<img src="https://openassistant-doc.vercel.app/img/keplerPlugin-1.png" width="400" alt="KeplerGL Tool" />

## Features

| Tool Name                                              | Description                                                                                                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [keplergl](/docs/map/variables/keplergl)               | Create interactive maps using Kepler.gl with support for point, line, arc, and GeoJSON visualizations. Supports color styling and data classification. |
| [leaflet](/docs/map/variables/leaflet)                 | Create lightweight maps using Leaflet.js from GeoJSON data with customizable styling and color schemes.                                                |
| [downloadMapData](/docs/map/variables/downloadMapData) | Download map data (GeoJSON or CSV) from URLs for use with other mapping tools.                                                                         |

## Installation

```bash
npm install @openassistant/map @openassistant/utils ai
```

## Quick Start

Suppose you have a dataset which could be fetched from your data API. The json data could look like this:

```json
const SAMPLE_DATASETS = {
  myVenues: [
    { "location": "New York", "latitude": 40.7128, "longitude": -74.0060, "revenue": 12500000, "population": 8400000 },
    { "location": "Los Angeles", "latitude": 34.0522, "longitude": -118.2437, "revenue": 9800000, "population": 4000000 },
    { "location": "Chicago", "latitude": 41.8781, "longitude": -87.6298, "revenue": 7500000, "population": 2700000 }
  ]
};
```

Share the meta data of your dataset in the system prompt, so the LLM can understand which datasets are available to use when creating a map.

:::note
The meta data is good enough for the AI assistant. Don't put the entire dataset in the context, and there is no need to share your dataset with the LLM models. This also helps to keep your dataset private.
:::

```js
const systemPrompt = `You can help users to create a map from a dataset.
Please always confirm the function calling and its arguments with the user.

Here is the dataset are available for function calling:
DatasetName: myVenues
Fields: location, longitude, latitude, revenue, population`;
```

You can use the `keplergl` tool to create a Kepler.gl map from a dataset.

```typescript
import { keplergl, KeplerglTool } from '@openassistant/map';
import { convertToVercelAiTool } from '@openassistant/utils';
import { streamText } from 'ai';

const keplerglTool: KeplerglTool = {
  ...keplergl,
  context: {
    getDataset: async (datasetName, variableName) => {
      // get the dataset for mapping, e.g. geojson dataset, csv, geoarrow etc.
      return SAMPLE_DATASETS[datasetName];
    },
  },
  onToolCompleted: (toolCallId, additionalData) => {
    console.log('Tool call completed:', toolCallId, additionalData);
    // you can import { KeplerGlComponent } from '@openassistant/keplergl';
    // render the Kepler.gl map using <KeplerGlComponent props={additionalData} />
  },
};
generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  system: systemPrompt,
  prompt: 'Create a point map using the dataset "my_venues"',
  tools: { createMap: convertToVercelAiTool(keplerglTool) },
});
```

:::note
The `keplergl` tool is not executable on server side since it requires rendering the map on the client side (in the browser). You need to use it on client, e.g.:
:::

```typescript
// on server side:
streamText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  system: systemPrompt,
  prompt: 'Can you create a point map of the venues in dataset myVenues?',
  tools: {
    // set isExecutable to false to avoid the tool being executed on server side
    keplergl: convertToVercelAiTool(keplerglTool, { isExecutable: false }),
  },
});

// on client side:
useChat({
  onToolCall: async ({ toolCall }) => {
    const { toolName, args, toolCallId } = toolCall;
    if (toolName === 'keplergl') {
      const keplerglTool = convertToVercelAiTool({
        ...keplergl,
        context: { getDataset, getGeometries },
        onToolCompleted,
      });
      return keplerglTool.execute?.(args as Record<string, unknown>, {
        toolCallId,
      });
    }
  },
});
```

Please see the [example](https://github.com/geodaopenjs/openassistant/tree/main/examples/vercel_map_example) for more details.

## Maps Example using AiAssistant

Here is an example of using @openassistant/ui to create interactive maps using the `keplergl` tool.

Install the dependencies:

```bash
npm install @openassistant/map @openassistant/ui @openassistant/keplergl
```

Then, you can use the `AiAssistant` component to create the maps.

```tsx
import { keplergl, KeplerglTool } from '@openassistant/map';
import { KeplerGlComponent } from '@openassistant/keplergl';
import { AiAssistant } from '@openassistant/ui';

const keplerglTool: KeplerglTool = {
  ...keplergl,
  context: {
    getDataset: async (datasetName) => {
      return SAMPLE_DATASETS[datasetName];
    },
  },
  component: KeplerGlComponent,
};

// use the tool in the chat component
<AiAssistant
  modelProvider="openai"
  model="gpt-4o"
  apiKey={process.env.OPENAI_API_KEY || ''}
  welcomeMessage="Hello! How can I help you create maps today?"
  system={systemPrompt}
  functions={{ keplergl: keplerglTool }}
/>;
```

## Download Map Data Example

You can use the `downloadMapData` tool to download map data from URLs and use it with other mapping tools.

```typescript
import { downloadMapData, keplergl, KeplerglTool } from '@openassistant/map';
import { convertToVercelAiTool, ToolCache } from '@openassistant/utils';
import { generateText } from 'ai';

const toolResultCache = ToolCache.getInstance();

const downloadMapTool = {
  ...downloadMapData,
  onToolCompleted: (toolCallId: string, additionalData?: unknown) => {
    toolResultCache.addDataset(toolCallId, additionalData);
  },
};

const keplerglTool: KeplerglTool = {
  ...keplergl,
  context: {
    getDataset: async (datasetName: string) => {
      // if no dataset is found, check if dataset is in toolResultCache
      if (toolResultCache.hasDataset(datasetName)) {
        return toolResultCache.getDataset(datasetName);
      }
      throw new Error(`Dataset ${datasetName} not found`);
    },
  },
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt:
    'Create a map from https://geodacenter.github.io/data-and-lab//data/Chi_Carjackings.geojson',
  tools: {
    keplergl: convertToVercelAiTool(keplerglTool),
    downloadMapData: convertToVercelAiTool(downloadMapTool),
  },
});
```

## Leaflet Maps Example

You can also create lightweight maps using Leaflet:

```typescript
import { leaflet, LeafletTool } from '@openassistant/map';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const leafletTool: LeafletTool = {
  ...leaflet,
  context: {
    getDataset: async (datasetName) => {
      return SAMPLE_DATASETS[datasetName];
    },
  },
  onToolCompleted: (toolCallId, additionalData) => {
    console.log('Tool call completed:', toolCallId, additionalData);
    // you can import { LeafletComponent } from '@openassistant/leaflet';
    // render the Leaflet map using <LeafletComponent props={additionalData} />
  },
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  system: systemPrompt,
  prompt: 'Create a leaflet map of the venues in dataset myVenues',
  tools: {
    leaflet: convertToVercelAiTool(leafletTool),
  },
});
```

Once set up, you can create maps through natural language prompts:

- For point maps: "Create a point map of the venues"
- For colored maps: "Show me a map colored by revenue"
- For downloaded data: "Create a map from this URL: [geojson-url]"

The assistant will automatically understand your request and use the appropriate mapping function.

See the [examples](https://github.com/geodaopenjs/openassistant/tree/main/examples) for more details.

### With TailwindCSS

If you are using TailwindCSS, make sure to include the package's CSS in your project:

```typescript
import { heroui } from '@hero-ui/react';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/@openassistant/keplergl/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/@openassistant/leaflet/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [heroui()],
};
```
