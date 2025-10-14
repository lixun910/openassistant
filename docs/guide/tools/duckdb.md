# DuckDB Tools

The `@openassistant/duckdb` package provides tools for executing SQL queries directly in the browser using DuckDB WASM.

## Installation

```bash
npm install @openassistant/duckdb
```

## Available Tools

### `localQuery`

Execute SQL queries on data provided through the context.

**Use Cases:**

- Analyze tabular data with SQL
- Aggregate and transform datasets
- Join multiple data sources
- Statistical computations

### `mergeTool`

Merge multiple datasets based on common keys.

**Use Cases:**

- Combine related datasets
- Left/right/inner joins
- Data enrichment

## Basic Usage

### Setting Up with Assistant

```typescript
import { localQuery } from '@openassistant/duckdb';
import { Assistant, type AssistantOptions } from '@openassistant/assistant';

// Sample datasets
const SAMPLE_DATASETS = {
  cities: [
    { name: 'San Francisco', population: 800000, state: 'CA' },
    { name: 'New York', population: 8400000, state: 'NY' },
    { name: 'Los Angeles', population: 3900000, state: 'CA' },
  ],
};

const localQueryTool = {
  ...localQuery,
  context: {
    getValues: async (datasetName: string, variableName: string) => {
      // Get the values of the variable from your dataset
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
};

const config: AssistantOptions = {
  ai: {
    getInstructions: () => `
      You are a helpful assistant. 
      You have access to a cities dataset with fields: name, population, state.
    `,
    tools: {
      localQuery: localQueryTool,
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

### Usage with Vercel AI SDK

```typescript
import { localQuery } from '@openassistant/duckdb';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const localQueryTool = {
  ...localQuery,
  context: {
    getValues: async (datasetName: string, variableName: string) => {
      // Implement your data retrieval logic here
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
};

const result = await generateText({
  model: openai('gpt-4'),
  prompt: 'What are the cities in California with population over 1 million?',
  tools: {
    localQuery: convertToVercelAiTool(localQueryTool),
  },
});

console.log(result.text);
```

## Advanced Features

### Working with Spatial Data

DuckDB supports spatial operations when combined with GeoJSON data:

```typescript
const localQueryTool = {
  ...localQuery,
  context: {
    getValues: async (datasetName: string, variableName: string) => {
      // Return spatial data (e.g., GeoJSON features)
      return SPATIAL_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
};

// The AI can then query spatial data
// Example prompt: "Find all neighborhoods with area greater than 5 square km"
```

### Context Options

The `localQuery` tool context supports the following methods:

```typescript
type LocalQueryContext = {
  // Required: Get values of a variable from a dataset
  getValues: (datasetName: string, variableName: string) => Promise<unknown[]>;
  
  // Optional: Provide custom DuckDB instance
  getDuckDB?: () => Promise<DuckDBInstance>;
  
  // Optional: Limit result length (default: 1000)
  getMaxQueryResultLength?: () => Promise<number>;
};
```

### Example with All Context Options

```typescript
import { localQuery } from '@openassistant/duckdb';
import { Assistant } from '@openassistant/assistant';

const DATASETS = {
  sales: [
    { product: 'Widget A', revenue: 1000, quarter: 'Q1' },
    { product: 'Widget B', revenue: 1500, quarter: 'Q1' },
    { product: 'Widget A', revenue: 1200, quarter: 'Q2' },
    { product: 'Widget B', revenue: 1800, quarter: 'Q2' },
  ],
};

const localQueryTool = {
  ...localQuery,
  context: {
    getValues: async (datasetName, variableName) => {
      return DATASETS[datasetName].map((item) => item[variableName]);
    },
    getMaxQueryResultLength: async () => 5000, // Custom limit
  },
};

const config = {
  ai: {
    getInstructions: () => `
      You have access to a sales dataset with fields: product, revenue, quarter.
      Help the user analyze sales data.
    `,
    tools: {
      localQuery: localQueryTool,
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

## Example User Prompts

The AI can respond to natural language queries like:

- "What is the average population of cities in California?"
- "Show me the top 5 cities by population"
- "Which state has the most cities?"
- "Calculate the total population grouped by state"

The tool will automatically generate and execute the appropriate SQL queries.

## Performance Tips

1. **Limit Result Sets**: The tool automatically truncates results for display
2. **Use Appropriate Data Types**: Helps query optimization
3. **Cache Results**: Store frequently accessed query results

## API Reference

For detailed API documentation, see the [DuckDB API Reference](/api/@openassistant/duckdb/README).

## Next Steps

- [GeoDA Tools](/guide/tools/geoda) - Spatial analysis tools
- [Plots Tools](/guide/tools/plots) - Visualize query results
- [Map Tools](/guide/tools/map) - Display spatial query results on maps
