# Creating Custom Tools

Learn how to create your own OpenAssistant tools that work with any AI framework.

## Tool Structure

All OpenAssistant tools conform to the `OpenAssistantTool` type:

```typescript
import { OpenAssistantTool } from '@openassistant/utils';
import { z } from 'zod';

// Define parameter schema using Zod
const myToolParams = z.object({
  param1: z.string().describe('First parameter'),
  param2: z.number().optional().describe('Second parameter'),
});

// Define context type
type MyToolContext = {
  getData: (id: string) => Promise<unknown>;
};

// Create the tool
export const myCustomTool: OpenAssistantTool<
  typeof myToolParams,
  string, // TLlmResult
  { details: unknown }, // TAdditionalData
  MyToolContext
> = {
  name: 'my_custom_tool',
  description: 'Description of what this tool does',
  parameters: myToolParams,
  
  // Context will be provided when using the tool
  context: {
    getData: async () => {
      throw new Error('getData not implemented');
    },
  },

  execute: async (args, options) => {
    try {
      const { param1, param2 } = args;
      const context = options?.context;
      
      // Your tool logic here
      const data = await context?.getData(param1);
      const result = performOperation(data, param2);
      
      return {
        llmResult: `Operation completed: ${result}`,
        additionalData: { details: data },
      };
    } catch (error) {
      return {
        llmResult: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
};

function performOperation(data: unknown, param2?: number) {
  // Implementation
  return 'result';
}
```

## Using Context

Provide application-specific data through context:

```typescript
import { OpenAssistantTool } from '@openassistant/utils';
import { z } from 'zod';

// Define the tool with context
const dataAnalysisParams = z.object({
  dataset: z.string(),
});

type DataAnalysisContext = {
  getData: (datasetName: string) => Promise<unknown[]>;
};

export const dataAnalysisTool: OpenAssistantTool<
  typeof dataAnalysisParams,
  string,
  unknown,
  DataAnalysisContext
> = {
  name: 'analyze_data',
  description: 'Analyze dataset',
  parameters: dataAnalysisParams,
  
  context: {
    getData: async () => {
      throw new Error('getData not implemented');
    },
  },

  execute: async (args, options) => {
    // Access data through context
    const data = await options?.context?.getData(args.dataset);
    
    // Perform analysis
    const analysis = analyzeData(data);
    
    return {
      llmResult: `Analysis: ${JSON.stringify(analysis)}`,
    };
  },
};

function analyzeData(data: unknown[] | undefined) {
  // Implementation
  return { count: data?.length || 0 };
}
```

## Framework Integration

### Vercel AI SDK

```typescript
import { convertToVercelAiTool } from '@openassistant/utils';
import { tool } from 'ai';

const aiTool = tool(convertToVercelAiTool(myCustomTool));
```

### LangChain

```typescript
import { convertToLangchainTool } from '@openassistant/utils';
import { tool } from '@langchain/core/tools';

const langchainTool = tool(convertToLangchainTool(myCustomTool));
```

## Best Practices

1. **Clear Descriptions**: Provide detailed descriptions for the tool and all parameters
2. **Error Handling**: Always catch and return errors gracefully
3. **Type Safety**: Use TypeScript for type-safe tool parameters
4. **Context Pattern**: Use context for application-specific dependencies
5. **Async Operations**: Make execute method async for I/O operations
6. **Testing**: Write unit tests for your tools

## Example: Weather Tool

```typescript
import { OpenAssistantTool } from '@openassistant/utils';
import { z } from 'zod';

// Define parameter schema
const weatherParams = z.object({
  location: z.string().describe('City name or coordinates'),
  units: z
    .enum(['celsius', 'fahrenheit'])
    .default('celsius')
    .describe('Temperature units'),
});

// Define result type
interface WeatherResult {
  temperature: number;
  condition: string;
  humidity: number;
}

// Define context type
type WeatherContext = {
  apiKey: string;
};

// Create the tool
export const weatherTool: OpenAssistantTool<
  typeof weatherParams,
  string,
  WeatherResult,
  WeatherContext
> = {
  name: 'get_weather',
  description: 'Get current weather for a location',
  parameters: weatherParams,
  
  context: {
    apiKey: '',
  },

  execute: async (args, options) => {
    try {
      const apiKey = options?.context?.apiKey;
      const response = await fetch(
        `https://api.weather.com/v1/weather?location=${args.location}&apikey=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Weather API request failed');
      }
      
      const data = await response.json();
      
      const weatherData: WeatherResult = {
        temperature: data.temp,
        condition: data.condition,
        humidity: data.humidity,
      };
      
      return {
        llmResult: `Weather in ${args.location}: ${weatherData.temperature}°${args.units === 'fahrenheit' ? 'F' : 'C'}, ${weatherData.condition}`,
        additionalData: weatherData,
      };
    } catch (error) {
      return {
        llmResult: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
};

// Usage - provide context when using
const myWeatherTool = {
  ...weatherTool,
  context: {
    apiKey: process.env.WEATHER_API_KEY!,
  },
};

// Execute directly
const result = await myWeatherTool.execute(
  { location: 'San Francisco', units: 'fahrenheit' },
  { toolCallId: 'test-1', context: myWeatherTool.context }
);
```

## Publishing Your Tool

1. Create a new package
2. Add dependencies
3. Export your tool class
4. Publish to npm

```json
{
  "name": "@myorg/weather-tool",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "peerDependencies": {
    "@openassistant/utils": "^1.0.0"
  }
}
```

## Next Steps

- [AI SDK Integration](/guide/advanced/ai-sdk-integration)
- [Utils API Reference](/api/@openassistant/utils/README)

