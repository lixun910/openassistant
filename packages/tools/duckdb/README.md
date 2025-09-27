# @openassistant/duckdb

This package provides several tools for querying and merging your data using DuckDB in the browser environment.

## Features

| Tool Name                                       | Description                                                                  |
| ----------------------------------------------- | ---------------------------------------------------------------------------- |
| [localQuery](/docs/duckdb/variables/localQuery) | Query any data that has been loaded in your application using user's prompt. |
| [mergeTables](/docs/duckdb/variables/mergeTables) | Merge two datasets (tables) using DuckDB SQL queries with horizontal or vertical merging. |
| [dbQuery](/docs/duckdb/variables/dbQuery)       | Query any database that you want to query.                                   |

## Installation

```bash
npm install @openassistant/duckdb @openassistant/utils ai
```

## Quick Start

Suppose you have datasets in your application, the data could be loaded from a csv/json/parquet/xml file. For this example, we will use the `SAMPLE_DATASETS` to simulate the data.

```ts
export const SAMPLE_DATASETS = {
  venues: [
    {
      id: 1,
      name: 'Golden Gate Park',
      city: 'San Francisco',
      latitude: 37.7694,
      longitude: -122.4862,
      rating: 4.5,
      revenue: 12500000,
    },
    {
      id: 2,
      name: 'Fisherman\'s Wharf',
      city: 'San Francisco',
      latitude: 37.8081,
      longitude: -122.4177,
      rating: 4.2,
      revenue: 8500000,
    },
    // ... more venues
  ],
  users: [
    { id: 1, name: 'John', city: 'San Francisco', age: 28 },
    { id: 2, name: 'Jane', city: 'San Francisco', age: 32 },
    // ... more users
  ],
};
```

Share the meta data of your datasets in the system prompt, so the LLM can understand which datasets are available to use when creating queries or merging data.

:::note
The meta data is good enough for the AI assistant. Don't put the entire dataset in the context, and there is no need to share your dataset with the LLM models. This also helps to keep your dataset private.
:::

```js
const systemPrompt = `You can help users to query and analyze datasets.
Please always confirm the function calling and its arguments with the user.

Here are the datasets available for function calling:
DatasetName: venues
Fields: id, name, city, latitude, longitude, rating, revenue

DatasetName: users  
Fields: id, name, city, age`;
```

### localQuery Tool

The LocalQueryTool class executes SQL queries against local datasets using DuckDB. This tool provides a class-based approach for database operations in the browser environment.

:::note
This tool should be executed in Browser environment for now.
:::

```typescript
import { LocalQueryTool } from '@openassistant/duckdb';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

// Create tool with custom context
const localQueryTool = new LocalQueryTool({
  context: {
    getValues: async (datasetName: string, variableName: string) => {
      // Get the values of the variable from your dataset
      const dataset = SAMPLE_DATASETS[datasetName];
      if (!dataset) {
        throw new Error(`Dataset '${datasetName}' not found`);
      }
      return dataset.map((item) => item[variableName]);
    },
  },
  onToolCompleted: (toolCallId, additionalData) => {
    console.log('Query completed:', toolCallId, additionalData);
  },
});

// Use with Vercel AI SDK
const result = await generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  system: systemPrompt,
  prompt: 'What is the average revenue of venues in San Francisco?',
  tools: {
    localQuery: convertToVercelAiTool(localQueryTool),
  },
});
```

:::note
The `localQuery` tool is not executable on server side since it requires rendering the table on the client side (in the browser). You need to use it on client, e.g.:
:::

- `app/api/chat/route.ts`

```typescript
import { localQuery } from '@openassistant/duckdb';
import { convertToVercelAiTool } from '@openassistent/utils';
import { streamText } from 'ai';

// localQuery tool will be running on the client side
const localQueryTool = convertToVercelAiTool(localQuery, {
  isExecutable: false,
});

export async function POST(req: Request) {
  // ...
  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: systemPrompt,
    messages: messages,
    tools: { localQuery: localQueryTool },
  });
}
```

- `app/page.tsx`

```typescript
import { useChat } from 'ai/react';
import { localQuery } from '@openassistant/duckdb';
import { convertToVercelAiTool } from '@openassistent/utils';

const myLocalQuery: LocalQueryTool = {
  ...localQuery,
  context: {
    ...localQuery.context,
    getValues: async (datasetName: string, variableName: string) => {
      // get the values of the variable from your dataset, e.g.
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
};

const localQueryTool = convertToVercelAiTool(myLocalQuery);

const { messages, input, handleInputChange, handleSubmit } = useChat({
  maxSteps: 20,
  onToolCall: async (toolCall) => {
    if (toolCall.name === 'localQuery') {
      const result = await localQueryTool.execute(
        toolCall.args,
        toolCall.options
      );
      return result;
    }
  },
});
```

### mergeTables Tool

The MergeTablesTool class merges two datasets (tables) using DuckDB SQL queries. This tool provides functionality for both horizontal and vertical merging operations in the browser environment.

:::note
This tool should be executed in Browser environment for now.
:::

#### Horizontal Merge (JOIN)

Merges tables side by side based on a common key column.

```typescript
import { MergeTablesTool } from '@openassistant/duckdb';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

// Create tool with custom context
const mergeTablesTool = new MergeTablesTool({
  context: {
    getValues: async (datasetName: string, variableName: string) => {
      const dataset = SAMPLE_DATASETS[datasetName];
      if (!dataset) {
        throw new Error(`Dataset '${datasetName}' not found`);
      }
      return dataset.map((item) => item[variableName]);
    },
  },
  onToolCompleted: (toolCallId, additionalData) => {
    console.log('Merge completed:', toolCallId, additionalData);
  },
});

// Use with Vercel AI SDK
const result = await generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  system: systemPrompt,
  prompt: 'Merge venues and users tables by city to see user preferences for venues',
  tools: {
    mergeTables: convertToVercelAiTool(mergeTablesTool),
  },
});
```

#### Vertical Merge (UNION)

Combines tables with the same columns by stacking them vertically.

```typescript
// Example for vertical merge
const result = await generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  system: systemPrompt,
  prompt: 'Combine two user datasets from different sources',
  tools: {
    mergeTables: convertToVercelAiTool(mergeTablesTool),
  },
});
```

#### Merge Types

- **Horizontal Merge**: Joins tables on a common key column
  - Example SQL: `SELECT A.id, A.name, A.revenue, B.age FROM venues A JOIN users B USING (city)`
- **Vertical Merge**: Combines tables with same columns
  - Example SQL: `SELECT id, name, city FROM venues UNION ALL SELECT id, name, city FROM users`

:::note
The `mergeTables` tool is not executable on server side since it requires rendering the table on the client side (in the browser). You need to use it on client, similar to the localQuery tool.
:::
