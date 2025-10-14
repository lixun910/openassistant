# AI SDK Integration

Learn how to integrate OpenAssistant tools with different AI frameworks.

## Vercel AI SDK

### Basic Setup

```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { tool } from 'ai';
import { LocalQueryTool } from '@openassistant/duckdb';

const queryTool = new LocalQueryTool({
  context: {
    getValues: async (dataset, variable) => {
      return await fetchData(dataset, variable);
    },
  },
});

const result = await generateText({
  model: openai('gpt-4'),
  tools: {
    query: queryTool.toVercelAiTool(tool),
  },
  prompt: 'Analyze the sales data',
});
```

### Streaming with Tools

```typescript
import { streamText } from 'ai';

const result = streamText({
  model: openai('gpt-4'),
  tools: {
    query: queryTool.toVercelAiTool(tool),
  },
  prompt: 'Analyze trends in the data',
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
```

### React Integration

```typescript
'use client';

import { useChat } from 'ai/react';

export default function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

## LangChain

### Basic Setup

```typescript
import { ChatOpenAI } from '@langchain/openai';
import { LocalQueryTool } from '@openassistant/duckdb';

const queryTool = new LocalQueryTool({
  context: {
    getValues: async (dataset, variable) => {
      return await fetchData(dataset, variable);
    },
  },
});

const model = new ChatOpenAI({
  modelName: 'gpt-4',
});

const tools = [queryTool.toLangChainTool()];

// Use with agent
```

## Anthropic SDK

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Convert tool to Anthropic format
const tool = queryTool.toAnthropicTool();

const message = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  tools: [tool],
  messages: [{ role: 'user', content: 'Analyze the data' }],
});
```

## Google AI SDK

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const tool = queryTool.toGoogleAiTool();

const model = genAI.getGenerativeModel({
  model: 'gemini-pro',
  tools: [tool],
});
```

## Custom Integration

For frameworks not directly supported:

```typescript
const customFormat = {
  name: tool.name,
  description: tool.description,
  parameters: tool.parameters,
  execute: async (args) => await tool.execute(args),
};
```

## Next Steps

- [Creating Custom Tools](/guide/advanced/custom-tools)
- [Tools Overview](/guide/tools/)

