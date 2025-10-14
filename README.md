# OpenAssistant

OpenAssistant focuses on providing a rich set of AI tools for spatial data analysis and GIS tasks. Unlike previous versions, v1.0.0 is framework-agnostic and can be integrated with any AI framework of your choice.

**Key Features:**

- 🗺️ **Spatial Analysis Tools**: Comprehensive suite of GeoDA tools for spatial statistics, LISA, Moran's I, spatial regression, and more.
- 🗄️ **DuckDB Integration**: Powerful in-browser SQL queries with DuckDB WASM for handling large datasets efficiently.
- 🌍 **OpenStreetMap Tools**: Access OSM data with geocoding, reverse geocoding, routing, and isochrone analysis.
- 📊 **Visualization Components**: Ready-to-use components for ECharts, Vega-Lite, Kepler.gl, and Leaflet visualizations.
- 📍 **Places & H3**: Location intelligence with place search, geotagging, and H3 hexagonal spatial indexing.
- 🤖 **AI Framework Agnostic**: Works with Vercel AI SDK, LangChain, Anthropic, and other popular AI frameworks.

## Quick Start

### 1. Use OpenAssistant tools in your AI application

#### Example: create a map

Add map tool to your AI application:

```ts
import { generateText } from 'ai';
import { map, MapTool } from '@openassistant/maps';
import { convertToVercelAiTool } from '@openassistant/utils';

// Create a kepler map tool with your context
const keplerMapTool = {
  ...keplergl,
  context: {
    getDataset: async (datasetName: string) => {
      if (datasetName in SAMPLE_DATASETS) {
        return SAMPLE_DATASETS[datasetName as keyof typeof SAMPLE_DATASETS];
      }
      throw new Error(`Dataset ${datasetName} not found`);
    },
  },
  component: KeplerGlComponent,
};

// Convert to Vercel AI SDK tool
const aiTool = tool(convertToVercelAiTool(keplerMapTool));

// Use in your AI application
```

<img src="https://geodaai.github.io/openassistant/kepler-tool-demo-1.gif" width="400" alt="Kepler.gl Tool Demo" />

#### Example: create a histogram

Add histogram tool to your AI application, e.g. Vercel AI SDK:

```ts
import { generateText } from 'ai';
import { histogram, HistogramTool } from '@openassistant/plots';
import { convertToVercelAiTool } from '@openassistant/utils';

const histogramTool: HistogramTool = {
  ...histogram,
  context: {
    // get the values of the variable from your dataset, e.g.
    getValues: async (datasetName, variableName) => {
      // you can retrieve the values from your dataset/database, e.g.:
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    },
  },
  onToolCompleted: (toolCallId, additionalData) => {
    // the call back function when the tool is completed
    // you can save it or use it to render a histogram component
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

<img src="https://openassistant-doc.vercel.app/img/histogram-1-400.png" width="400" alt="Histogram Plugin" />

You can combine all the tools together to create a more complex application.

### 2. Create your own tool

Create a weather tool to return the weather from a weather station you installed at different cities.

```ts
import { OpenAssistantTool, convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';
import { z } from 'zod';

const weatherTool: OpenAssistantTool<{ cityName: string }, { weather: string }, { station: string }> = {
  name: 'getWeather',
  description: 'Get the weather in a city from a weather station',
  parameters: z.object({ cityName: z.string() }),
  context: {
    // provide your own implementation to get the data from your application as a context
    const stations = {
      'New York': {
        stationId: '123',
        weather: 'sunny',
        timestamp: '2025-06-20 10:00:00',
      },
    };
    return stations[args.cityName];
  },
  execute: async (args, options) => {
    if (!options || !options.context || !options.context['getStation']) {
      throw new Error('Context is required');
    }
    const getStation = options.context['getStation'];
    const station = await getStation(args.cityName);
    return {
      // the result returned to the LLM
      llmResult: {
        success: true,
        result: `The weather in ${args.cityName} is ${station.weather} from weather station ${station.station}.`,
      },
      // the additional data for e.g. rendering a component or saving to your database
      additionalData: {
        station,
      },
    };
  },
});
```

### 3. Add Chat Interface to your App

OpenAssistant provides a chat interface component based on [@sqlrooms/ai](https://github.com/sqlrooms/sqlrooms).

#### Usage

```tsx
import { Assistant, type AssistantOptions } from '@openassistant/assistant';
import { z } from 'zod';

const config: AssistantOptions = {
  ai: {
    getInstructions: () => 'You are a helpful assistant.',
    tools: {
      echo: {
        description: 'Echo the input',
        parameters: z.object({
          input: z.string().describe('The input to echo'),
        }),
        execute: async ({ input }: { input: string }) => {
          return {
            llmResult: {
              success: true,
              output: input,
            },
          };
        },
        context: {},
      },
    },
  },
};

export function App() {
  return (
    <div className="flex h-screen w-screen items-center justify-center p-4">
      <div className="w-full max-w-[900px] h-full">
        <Assistant options={config} />
      </div>
    </div>
  );
}
```

Add the following configurations to your `tailwind.config.js` file:

```tsx
import { sqlroomsTailwindPreset } from '@sqlrooms/ui';

const preset = sqlroomsTailwindPreset();
const config = {
  ...preset,
  content: ['src/**/*.{ts,tsx}', '../../node_modules/@sqlrooms/*/dist/**/*.js'],
  theme: {
    ...preset.theme,
    extend: {
      ...preset.theme?.extend,
    },
  },
};

export default config;
```

<video src="https://sqlrooms.org/assets/ai-example-light.Bgw76g3w.mp4" width="300" controls autoplay loop muted />

If you want to build your own chat interface, just simply pass your custom component in <Assistant> component.

```tsx
import { Assistant, type AssistantOptions } from '@openassistant/assistant';
import { z } from 'zod';

const config: AssistantOptions = {
  ai: {
    getInstructions: () => 'You are a helpful assistant.',
    tools: {},
  },
};

export function App() {
  return (
    <div className="flex h-screen w-screen items-center justify-center p-4">
      <div className="w-full max-w-[900px] h-full">
        <Assistant options={config}>
          <CustomComponent />
        </Assistant>
      </div>
    </div>
  );
}
```

For more details, you can follow the source code of [packages/ai](https://github.com/geodaopenjs/openassistant/tree/main/packages/ai), which is a wrapper of [@sqlrooms/ai](https://github.com/sqlrooms/sqlrooms/tree/main/examples/ai-core).

### 4. Use openassistant core package

NOTE: this will be deprecated in the OpenAssistant v1. You can use e.g. Vercel AI SDK v5 instead.

You can also use the OpenAssistant core package [@openassistant/core](https://openassistant-doc.vercel.app/docs/core/), which provides a uniform interface for different AI providers, to build your own AI assistant, along with a design allows you to easily create your own tools by :

- providing your own context (e.g. data, callbacks etc.) for the tool execution
- providing your own UI component for rendering the tool result
- passing the result from the tool execution to the tool UI component or next tool execution.

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
  tools: {},
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

OpenAssistant supports the following model providers:

| Model Provider | Models                                                                                             | Dependency         |
| -------------- | -------------------------------------------------------------------------------------------------- | ------------------ |
| OpenAI         | [models](https://sdk.vercel.ai/providers/ai-sdk-providers/openai#model-capabilities)               | @ai-sdk/openai     |
| Google         | [models](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai#model-capabilities) | @ai-sdk/google     |
| Anthropic      | [models](https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic#model-capabilities)            | @ai-sdk/anthropic  |
| DeepSeek       | [models](https://sdk.vercel.ai/providers/ai-sdk-providers/deepseek#model-capabilities)             | @ai-sdk/deepseek   |
| xAI            | [models](https://sdk.vercel.ai/providers/ai-sdk-providers/xai#model-capabilities)                  | @ai-sdk/xai        |
| Ollama         | [models](https://ollama.com/models)                                                                | ollama-ai-provider |

:::

## 📄 License

MIT © [Xun Li](mailto:lixun910@gmail.com)
