---
sidebar_position: 2
sidebar_label: Create Your Own Tool
---

# Create Your Own Tool

Openassistant extends the tool interface from Vercel AI SDK, in which a tool consists of three properties:

- `description`: An optional description of the tool that can influence when the tool is picked.
- `parameters`: A Zod schema or a JSON schema that defines the parameters. The schema is consumed by the LLM, and also used to validate the LLM tool calls.
- `execute`: An optional async function that is called with the arguments from the tool call.

Here is the example of a tool in Vercel AI SDK:

```ts
import { z } from 'zod';
import { generateText, tool } from 'ai';

const result = await generateText({
  model: yourModel,
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      parameters: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
  },
  prompt: 'What is the weather in San Francisco?',
});
```

## Quick Start

To create your own tool in OpenAssistant, you need to use the `extendedTool` function from the `@openassistant/utils` package.

```bash
npm install @openassistant/utils
```

The `extendedTool` function is a wrapper around the `tool` function from the `ai` package. It allows you to add context and callback function support to your tool.

For example, create a weather tool to return the weather from a weather station you installed at different cities.

```ts
import { extendedTool, convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';
import { z } from 'zod';

const weatherTool = extendedTool({
  description: 'Get the weather in a city from a weather station',
  parameters: z.object({ cityName: z.string() }),
  context: {
    getStation: async (cityName: string) => {
      // provide your own implementation to get the data from your application as a context
      const stations = {
        'New York': {
          stationId: '123',
          weather: 'sunny',
          timestamp: '2025-06-20 10:00:00',
        },
        'Los Angeles': {
          stationId: '456',
          weather: 'cloudy',
          timestamp: '2025-06-20 10:00:00',
        },
        Chicago: {
          stationId: '789',
          weather: 'rainy',
          timestamp: '2025-06-20 10:00:00',
        },
      };
      return stations[cityName];
    },
  },
  execute: async (args, options) => {
    // check if the context is provided
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

// use the tool in your application
const result = await generateText({
  model: openai('gpt-4o', { apiKey: key }),
  system: 'You are a helpful assistant',
  prompt: 'What is the weather in New York?',
  tools: { weather: convertToVercelAiTool(weatherTool) },
});
```

The output of the result could be:

```bash
The weather in New York is sunny from your weather station 123.
```

The `additionalData` is the data returned from the tool execution. You can use it to render a component or save it to your database.

See the full example code 🔗 [here](https://github.com/geodaopenjs/openassistant/tree/main/examples/zod_function_tools).

## Why `extendedTool`?

While the Vercel AI SDK's tool interface is powerful for basic use cases, it has limitations when building complex AI applications that need to:

1. **Access Application-Specific Data**: Tools often need to interact with your application's data, databases, or external services. The basic tool interface doesn't provide a way to pass application context to the tool execution.

2. **Handle Tool Results**: After a tool executes, you typically want to do something with the result - render a UI component, save to a database, trigger another process, etc. The basic interface only returns results to the LLM.

3. **Support Complex Workflows**: Many real-world applications require tools that can access multiple data sources, perform multi-step operations, or integrate with existing application logic.

4. **Easy Tool Extension**: You can create and publish your own tools without worrying about data security or API access - users will implement their own context and callback functions to use your tool.

OpenAssistant extends the tool interface by adding:

- **Context Object**: Allows you to pass application-specific data, functions, and state to your tools
- **Callback Functions**: Enables you to handle tool results and trigger additional actions
- **Additional Data**: Separates data returned to the LLM from data used for UI rendering or other application logic

Here's a comparison:

**Basic Vercel AI SDK Tool:**

```ts
tool({
  description: 'Get user data',
  parameters: z.object({ userId: z.string() }),
  execute: async ({ userId }) => {
    // No access to application context
    // Can only return data to LLM
    return { name: 'John Doe' };
  },
});
```

**OpenAssistant Extended Tool:**

```ts
extendedTool({
  description: 'Get user data',
  parameters: z.object({ userId: z.string() }),
  context: {
    getUserFromDatabase: async (userId) => {
      // Access to your application's database
      return await db.users.findUnique({ where: { id: userId } });
    },
  },
  execute: async (args, options) => {
    const user = await options.context.getUserFromDatabase(args.userId);
    return {
      llmResult: { name: user.name }, // Data for LLM
      additionalData: { user }, // Data for UI/application logic
    };
  },
  onToolCompleted: (toolCallId, additionalData) => {
    // Handle tool completion - update UI, save to cache, etc.
    console.log('User data retrieved:', additionalData.user);
  },
});
```

This extension makes it much easier to build AI applications that integrate seamlessly with your existing codebase and provide rich, interactive experiences.
