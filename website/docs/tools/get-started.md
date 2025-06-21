---
sidebar_position: 1
---

# Get Started

## Introduction

Tools like **[Function Calling](https://platform.openai.com/docs/guides/function-calling?api-mode=responses)** allow your AI Assistant to perform specific tasks by invoking predefined functions in your application to handle specialized operations, improving its usefulness and responsiveness. Use cases that function calling in AI Assistant is useful for:

- Custom business logic or domain-specific algorithms with private data
- Data analysis tasks (e.g., clustering algorithms, statistical analysis)
- Visualization generation (e.g., creating maps, charts based on your data)
- Complex mathematical computations
- Integration with internal or external services or APIs

OpenAssistant provides a set of tools that helps you build your AI application.

- Plot tools
- Map tools
- Data Analysis tools
- DuckDB tools
- OSM tools

## Quick Start

To get a quick start, let's use the **localQuery** tool in @openassistant/duckdb to build a simple AI assistant that can help users query their own data using natural language.

Let's say you have a dataset in your application. For this example, we will use the *[SAMPLE_DATASETS](https://github.com/GeoDaCenter/openassistant/blob/main/examples/duckdb_esbuild/src/dataset.ts)* to simulate the data:

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

First, let's import the `localQuery` tool from @openassistent/duckdb and provide the context for the tool:

```ts
import { localQuery, LocalQueryTool } from '@openassistent/duckdb';

// type safety for the localQuery tool
const localQueryTool: LocalQueryTool = {
  ...localQuery,
  context: {
    getValues: async (datasetName: string, variableName: string) => {
      return SAMPLE_DATASETS[datasetName][variableName];
    },
  },
};
```

Then, you can use the tool in your AI assistant or in the chat component.

### use localQuery tool with Vercel AI SDK

```ts
import { generateText } from 'ai';
import { convertToVercelAiTool } from '@openassistant/utils';

const instructions = `You are a helpful assistant. You can use the following datasets to answer the user's question: 
  datasetName: myVenues,
  variables: index, location, latitude, longitude, revenue, population
`;

// use tool with vercel ai sdk
const result = await generateText({
  model: openai('gpt-4o', { apiKey: key }),
  system: instructions,
  prompt: 'which location has the highest revenue?',
  tools: { localQuery: convertToVercelAiTool(localQueryTool) },
});
```

### Use localQuery tool with openassistant chat component

```tsx
import { AiAssistant } from '@openassistant/ui';

export default function App() {
  return (
    <AiAssistant
      modelProvider="openai"
      model="gpt-4o"
      apiKey="your-api-key"
      version="0.0.1"
      welcomeMessage="Hello! How can I help you today?"
      instructions={instructions}
      functions={{ localQuery: localQueryTool }}
    />
  );
}
```

🚀 Try it out!

<img width="400" src="https://github.com/user-attachments/assets/4115b474-13af-48ba-b69e-b39cc325f1b1"/>

See the source code of the example 🔗 [here](https://github.com/geodacenter/openassistant/tree/main/examples/duckdb_esbuild).

:::tip
Why does LLM know it can call the `localQuery` tool to answer the user's question?

- when establishing the conversation, the LLM will be provided with the `instructions` and `tools` parameters.
- when you prompt 'which location has the highest revenue?', the LLM will know it can call the `localQuery` tool to answer the user's question.
- when calling this tool, the LLM will know this tool needs parameters: `datasetName=myVenues` and `variableName=revenue` from the conversation context
- to answer the user's question, the LLM will know it needs a SQL query to get the result:
  ```sql
  SELECT location, revenue FROM myVenues ORDER BY revenue DESC LIMIT 1;
  ```

These are the emergent behaviors (learning, reasoning, and tool use) of the LLM when it is provided with the `instructions` and `tools` parameters. It is a powerful feature that allows you to build your own AI assistant with your own data and tools.
:::
