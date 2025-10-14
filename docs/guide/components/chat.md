# Assistant Component

The `@openassistant/assistant` package provides a full-featured AI assistant chat interface.

## Installation

```bash
npm install @openassistant/assistant
```

## Components

- **Assistant** - Main AI assistant chat interface
- **MainView** - Default chat view with settings panel

## Basic Usage

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

export default function App() {
  return (
    <div className="h-screen w-screen">
      <Assistant options={config} />
    </div>
  );
}
```

## Configuration

### AssistantOptions

- `ai.getInstructions` - Function that returns system instructions for the AI
- `ai.tools` - Object containing tool definitions
- `aiSettings.initialSettings` - Optional initial AI provider settings
- `persistKey` - Optional key for persisting state (default: 'openassistant-ai-state-storage')

## API Reference

For detailed API documentation, see the [Assistant API Reference](/api/@openassistant/assistant/README).

