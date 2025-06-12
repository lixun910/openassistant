---
sidebar_position: 1
---

# OpenAssistant

[Documentation](https://openassistant-doc.vercel.app)

OpenAssistant is a javascript library helping your build your AI application with powerful data analysis tools and an interactive React chat component.

See an example using using geotools, spatial join and map tools with LLM to answer a user's question:

```
Can you map the buffered (100 meters) driving route between "123 Main St, San Francisco, CA" and "450 10th St, San Francisco, CA"?
```

<img width="600" alt="Screenshot 2025-04-25 at 10 22 08 PM" src="https://github.com/user-attachments/assets/234aeaf3-0a70-486a-92f6-71eff957af49" />

- Check out the example code 🔗 [here](https://github.com/GeoDaCenter/openassistant/tree/main/examples/geoda_tools).
- See a tutorial using OpenAssistant in Kepler.gl 🔗 [here](https://github.com/keplergl/kepler.gl/discussions/2843).

OpenAssistant provides the following AI tools which are compatible with [Vercel AI SDK](https://sdk.vercel.ai/docs):

| Category | Tool/Feature | Description |
|----------|--------------|-------------|
| **Plot Tools** | Static plots | All plot types using Vega-Lite |
| | Interactive plots | eCharts: box plot, bubble chart, histogram, parallel coordinates, scatter plot with regression lines |
| **GeoTools** | Geocoding | Using OSM API |
| | Routing | Using Mapbox API |
| | Isochrone | Using Mapbox API |
| | Geographic boundaries | U.S. state/county/zipcode |
| **Map Tools** | Kepler.gl | Interactive map visualization |
| | Leaflet map | Web mapping library |
| **DuckDB Tools** | Local data querying | Query local data using DuckDB |
| | Table operations | Merge, filter, sort, group by, aggregate, etc. |
| **Data Analysis Tools (GeoDa)** | Data classification | Quantile, equal interval, natural breaks, standard deviation, percentile, box, etc. |
| | Data standardization | Z-score, deviation from mean, MAD, range adjust, range standardization, etc. |
| | Spatial operations | Buffer, area, centroid, dissolve, length, perimeter, Minimum Spanning Tree, Thiessen polygons (Voronoi diagram) |
| | Spatial join | Join spatial datasets |
| | Spatial dissolve/aggregate | Combine spatial features |
| | Spatial weights | Queen/rook contiguity, KNN weights, distance-based weights, kernel weights |
| | Global spatial analysis | Global Moran's I |
| | Local spatial analysis (LISA) | Local Moran's I, local Getis-Ord Gi*, local Geary, quantile LISA |
| | Spatial regression | OLS, spatial lag, spatial error model |

### Why use LLM tools?

LLMs are fundamentally statistical language models that predict the next tokens based on the context. While emergent behaviors such as learning, reasoning, and tool use enhance the model's capabilities, LLMs do not natively perform precise or complex computations and algorithms. For example, when asked to compute the square root of a random decimal number, ChatGPT typically provides an incorrect answer unless its Python tool is explicitly called to perform the calculation. This limitation becomes even more apparent with complex tasks in engineering and scientific domains. Providing computational tools for LLMs offers a solution for overcoming this problem and helps you successfully integrate LLMs with your applications.

Check out the following examples using OpenAssistant in action:

- [kepler.gl AI Assistant (kepler.gl)](https://location.foursquare.com/resources/blog/products/foursquare-brings-enterprise-grade-spatial-analytics-to-your-browser-with-kepler-gl-3-1/)
- [GeoDa.AI AI Assistant (geoda.ai)](https://geoda.ai)
- [SqlRooms (sqlrooms.org)](https://sqlrooms-ai.netlify.app/)

## Getting Started

### 1. Use OpenAssistant tools in your vercel AI application

#### Install the tools

For example, install the echarts tool:

```bash
npm install @openassistant/plots
```

Add histogram tool to your application:

```ts
import { histogram, HistogramTool } from '@openassistant/plots';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const histogramTool: HistogramTool = {
  ...histogram,
  context: {
    // get the values of the variable from your dataset, e.g.
    getValues: async (datasetName, variableName) => {
      // your getValues from Natregimes dataset and variable HR60, e.g.:
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    },
  },
  onToolCompleted: (toolCallId, additionalData) => {
    // the call back function when the tool is completed
    console.log('toolCallId: additionalData', toolCallId, additionalData);
  },
};

// use tool with vercel ai sdk
const result = await generateText({
  model: openai('gpt-4o', { apiKey: key }),
  system: 'You are a helpful assistant',
  prompt: 'create a histogram of HR60 in dataset Natregimes',
  tools: { histogram: convertToVercelAiTool(histogramTool) },
});
```

When user prompts e.g. "`create a histogram of HR60 in dataset Natregimes`", the LLM will call the **histogram** tool which will call the **getValues()** function to get the data, create a histogram, return the result to the LLM and invoke callback function **onToolCompleted()** with the tool call id and additional data. For example, the output of the callback function could be:

```bash
toolCallId call_HFlIW3My59rzp3fA3M4bWTjb
additionalData {
  id: '8i9xjm05iff',
  datasetName: 'Natregimes',
  variableName: 'HR60',
  histogramData: [
    { bin: 0, binStart: 1, binEnd: 2.8 },
    { bin: 1, binStart: 2.8, binEnd: 4.6 },
    { bin: 2, binStart: 4.6, binEnd: 6.4 },
    { bin: 3, binStart: 6.4, binEnd: 8.2 },
    { bin: 4, binStart: 8.2, binEnd: 10 }
  ],
  barDataIndexes: [ [ 0, 1 ], [ 2, 3 ], [ 4, 5 ], [ 6, 7 ], [ 8, 9 ] ],
  theme: 'light',
  isDraggable: false,
  isExpanded: false,
  onSelected: undefined
}
```

See the example code 🔗 [here](https://github.com/GeoDaCenter/openassistant/tree/main/examples).

### 2. Add a React Chat Component to your App

OpenAssistant also provides a chat component that helps you build your AI application with an interactive chat interface.
Click [here](https://openassistant-doc.vercel.app/docs/chatui/add-config-ui) for more details about the chat components.

#### Installation

```bash
npm install @openassistant/ui
```

#### Usage

```tsx
import { AiAssistant } from '@openassistant/ui';
// for React app without tailwindcss, you can import the css file
// import '@openassistant/ui/dist/index.css';

function App() {
  return (
    <AiAssistant
      modelProvider="openai"
      model="gpt-4"
      apiKey="your-api-key"
      version="v1"
      welcomeMessage="Hello! How can I help you today?"
      instructions="You are a helpful assistant."
      functions={{}}
      theme="dark"
      useMarkdown={true}
      showTools={true}
      onMessageUpdated=({messages}) => {
        console.log(messages);
      }}
    />
  );
}
```

<img src="https://openassistant-doc.vercel.app/img/getstart-dark.png" width="300" />

See the source code of the example 🔗 [here](https://github.com/geodacenter/openassistant/tree/main/examples).

:::tip

If you are using TailwindCSS, you need to add the following configurations to your `tailwind.config.js` file:

```tsx
import { nextui } from '@heroui/react';
...

module.exports = {
  content: [
    ...,
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/@openassistant/ui/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [nextui()],
};
```

See the source code of the example 🔗 [here](https://github.com/geodacenter/openassistant/tree/main/examples).
:::

#### Use Tools with chat component

For a quick example:

**localQuery** in @openassistant/duckdb

This tool helps to query any data that has been loaded in your application using user's prompt.

- the data in your application will be loaded into a local duckdb instance temporarily
- LLM will generate SQL query based on user's prompt against the data
- the SQL query result will be executed in the local duckdb instance
- the query result will be displayed in a React table component

In your application, the data could be loaded from a csv/json/parquet/xml file. For this example, we will use the `SAMPLE_DATASETS` in `dataset.ts` to simulate the data.

```ts
export const SAMPLE_DATASETS = {
  myVenues: [
    {
      index: 0,
      location: 'New York',
      latitude: 40.7128,
      longitude: -74.006,
      revenue: 12500000,
      population: 8400000,
    },
    ...
  ],
};
```

- Import the `localQuery` tool from `@openassistent/duckdb` and use it in your application.
- Provide the `getValues` function in the `context` to get the values from your data.
- Use the tool in your AI assistant chat component

```ts
import { localQuery, LocalQueryTool } from '@openassistent/duckdb';

// load your data
// pass the metadata of the data to the assistant instructions
const instructions = `You are a helpful assistant. You can use the following datasets to answer the user's question:
  datasetName: myVenues,
  variables: index, location, latitude, longitude, revenue, population
  `;

// use `LocalQueryTool` for type safety
const localQueryTool: LocalQueryTool = {
  ...localQuery,
  context: {
    ...localQuery.context,
    getValues: (datasetName: string, variableName: string) => {
      return SAMPLE_DATASETS[datasetName][variableName];
    },
  },
};

// use the tool in the chat component
<AiAssistant
  modelProvider="openai"
  model="gpt-4o"
  apiKey="your-api-key"
  version="0.0.1"
  welcomeMessage="Hello! How can I help you today?"
  instructions={instructions}
  functions={{ localQuery: localQueryTool }}
/>
```

🚀 Try it out!

<img width="400" src="https://github.com/user-attachments/assets/4115b474-13af-48ba-b69e-b39cc325f1b1"/>

See the source code of the example 🔗 [here](https://github.com/geodacenter/openassistant/tree/main/examples/duckdb_esbuild).

For message persistence, see the example 🔗 [here](https://github.com/geodacenter/openassistant/tree/main/examples/message_persistence).

### 3. Use a uniform interface for different AI providers

If you want to build your own chat interface, you can use the OpenAssistant core package, whic provides

- a uniform interface for different AI providers
- a set of powerful LLM tools (data analysis, visualization, mapping, etc.)
- an interactive React chat component (optional)

for building your own AI assistant, along with a design allows you to easily create your own tools by :

- providing your own context (e.g. data, callbacks etc.) for the tool execution
- providing your own UI component for rendering the tool result
- passing the result from the tool execution to the tool UI component or next tool execution.

#### Installation

Install the core packages:

```bash
npm install @openassistant/core
```

#### Usage

Then, you can use the OpenAssistant in your application. For example:

```ts
import { createAssistant } from '@openassistant/core';

// get the singleton assistant instance
const assistant = await createAssistant({
  name: 'assistant',
  modelProvider: 'openai',
  model: 'gpt-4o',
  apiKey: 'your-api-key',
  version: '0.0.1',
  instructions: 'You are a helpful assistant',
  // functions: {{}},
  // abortController: null
});

// now you can send prompts to the assistant
await assistant.processTextMessage({
  textMessage: 'Hello, how are you?',
  streamMessageCallback: ({ isCompleted, message }) => {
    console.log(isCompleted, message);
  },
});
```

See the source code of the example 🔗 [here](https://github.com/GeoDaCenter/openassistant/tree/main/examples/cli_example).

:::tip

If you want to use Google Gemini as the model provider, you can do the following:

Install vercel google gemini client:

```bash
npm install @ai-sdk/google
```

Then, you can use update the assistant configuration to use Google Gemini.

OpenAssistant also supports the following model providers:

| Model Provider | Models                                                                                             | Dependency         |
| -------------- | -------------------------------------------------------------------------------------------------- | ------------------ |
| OpenAI         | [link](https://sdk.vercel.ai/providers/ai-sdk-providers/openai#model-capabilities)                 | @ai-sdk/openai     |
| Google         | [models](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai#model-capabilities) | @ai-sdk/google     |
| Anthropic      | [models](https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic#model-capabilities)            | @ai-sdk/anthropic  |
| DeepSeek       | [models](https://sdk.vercel.ai/providers/ai-sdk-providers/deepseek#model-capabilities)             | @ai-sdk/deepseek   |
| xAI            | [models](https://sdk.vercel.ai/providers/ai-sdk-providers/xai#model-capabilities)                  | @ai-sdk/xai        |
| Ollama         | [models](https://ollama.com/models)                                                                | ollama-ai-provider |

:::

See an example of using OpenAssistant core package to create your own tools 🔗 [here](https://github.com/GeoDaCenter/openassistant/tree/main/examples/zod_function_tools).

See a more complex example of using OpenAssistant core package to create a multi-step tool 🔗 [here](https://github.com/GeoDaCenter/openassistant/tree/main/examples/multisteps_tools).

## 🎯 Examples

Check out our example projects:

- [Basic Example](examples/cli_example/README.md)
- [Custom Function Example](examples/zod_function_tools/README.md)
- [Multiple Step Tools](examples/multisteps_tools/README.md)
- [Message Persistence Example](examples/message_persistence/README.md)
- [Simple React Example](examples/simple_react/README.md)
- [React with TailwindCSS Example](examples/react_tailwind/README.md)
- [Tool Example: ECharts](examples/echarts_plugin/README.md)
- [Tool Example: DuckDB](examples/duckdb_esbuild/README.md)
- [Tool Example: KeplerGl](examples/keplergl_plugin/README.md)
- [Tool Example: DeckGl](examples/deckgl_assistant/README.md)

## 📄 License

MIT © [Xun Li](mailto:lixun910@gmail.com)
