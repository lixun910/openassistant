# Getting Started

This guide will help you set up OpenAssistant in your project and create your first AI-powered spatial analysis tool.

## Prerequisites

- Node.js 18+ or compatible runtime
- A package manager (npm, yarn, or pnpm)
- Basic knowledge of TypeScript and React (for component usage)
- An AI provider API key (OpenAI, Anthropic, Google AI, etc.)

## Installation

OpenAssistant is organized as a monorepo with multiple packages. Install only the packages you need:

### Core Utilities

```bash
npm install @openassistant/utils
```

### Tools

```bash
# Database tools
npm install @openassistant/duckdb

# Spatial analysis tools
npm install @openassistant/geoda

# Map tools
npm install @openassistant/map

# OpenStreetMap tools
npm install @openassistant/osm

# Location tools
npm install @openassistant/places

# Plotting tools
npm install @openassistant/plots

# H3 spatial indexing
npm install @openassistant/h3
```

### Components (React)

```bash
# Chat interface
npm install @openassistant/chat

# Visualization components
npm install @openassistant/echarts
npm install @openassistant/keplergl
npm install @openassistant/leaflet
npm install @openassistant/vegalite
npm install @openassistant/tables
```

## Quick Start with Vercel AI SDK

Here's a simple example using DuckDB tools with the Vercel AI SDK:

### 1. Install Dependencies

```bash
npm install @openassistant/duckdb @openassistant/utils ai @ai-sdk/openai
```

### 2. Create a Tool Instance

```typescript
import { localQuery } from '@openassistant/duckdb';

// Create a tool with your custom context
const queryTool = {
  ...localQuery,
  context: {
    getValues: async (datasetName: string, variableName: string) => {
      // Fetch your data from wherever it's stored
      // This could be an API, local storage, etc.
      const response = await fetch(`/api/data/${datasetName}/${variableName}`);
      return response.json();
    },
  },
};
```

### 3. Convert to AI SDK Tool

```typescript
import { convertToVercelAiTool } from '@openassistant/utils';
import { tool } from 'ai';

// Convert OpenAssistant tool to Vercel AI SDK format
const aiTool = tool(convertToVercelAiTool(queryTool));
```

### 4. Use in Your AI Application

```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const result = await generateText({
  model: openai('gpt-4'),
  tools: {
    query: aiTool,
  },
  prompt: 'Calculate the average population for cities in California',
});

console.log(result.text);
```

## Quick Start with LangChain

OpenAssistant tools can also be used with LangChain:

```typescript
import { localQuery } from '@openassistant/duckdb';
import { convertToLangchainTool } from '@openassistant/utils';
import { tool } from '@langchain/core/tools';

const queryTool = {
  ...localQuery,
  context: {
    getValues: async (datasetName, variableName) => {
      // Your data fetching logic
      return [];
    },
  },
};

// Convert to LangChain tool
const langchainTool = tool(convertToLangchainTool(queryTool));

// Use with LangChain agent
```

## Client-Side vs Server-Side

OpenAssistant tools can run both in the browser (client-side) and on the server (server-side):

### Client-Side Example

```typescript
'use client';

import { useChat } from 'ai/react';
import { localQuery } from '@openassistant/duckdb';

export default function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });

  // Tool instances can be defined on the client
  const queryTool = {
    ...localQuery,
    context: {
      getValues: async (dataset, variable) => {
        // Access client-side data
        return window.myDataStore.get(dataset, variable);
      },
    },
  };

  // ... rest of your component
}
```

### Server-Side Example

```typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { localQuery } from '@openassistant/duckdb';
import { convertToVercelAiTool } from '@openassistant/utils';
import { tool } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const queryTool = {
    ...localQuery,
    context: {
      getValues: async (dataset, variable) => {
        // Access server-side database
        return await db.query(dataset, variable);
      },
    },
  };

  const result = streamText({
    model: openai('gpt-4'),
    messages,
    tools: {
      query: tool(convertToVercelAiTool(queryTool)),
    },
  });

  return result.toDataStreamResponse();
}
```

## Tool Output Management

OpenAssistant provides utilities for managing tool outputs between client and server:

```typescript
import { ToolOutputManager } from '@openassistant/utils';

// Initialize the output manager
const outputManager = new ToolOutputManager();

// Register tools
outputManager.registerTool('query', queryTool);
outputManager.registerTool('map', mapTool);

// Retrieve tool outputs
const output = await outputManager.getToolOutput('query', 'tool-call-id');
```

## Next Steps

Now that you have OpenAssistant set up, explore:

- [Architecture](/guide/architecture) - Understand how OpenAssistant works
- [Tools Overview](/guide/tools/) - Learn about available tools
- [DuckDB Tools](/guide/tools/duckdb) - Deep dive into database tools
- [Map Tools](/guide/tools/map) - Work with spatial data
- [Creating Custom Tools](/guide/advanced/custom-tools) - Build your own tools

