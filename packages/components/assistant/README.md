# @openassistant/assistant

An AI Assistant chat UI component for OpenAssistant.

## Installation

```bash
yarn add @openassistant/assistant
# or
npm install @openassistant/assistant
```

## Usage

```tsx
import { Assistant, type AssistantOptions } from '@openassistant/assistant';

const config: AssistantOptions = {
  ai: {
    getInstructions: () => 'You are a helpful assistant.',
    tools: {
      // your tools here
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

## Optional xAI provider

- This package can work with multiple providers via the AI SDK v5.
- If you intend to use xAI, install the optional peer dependency in your app:

```bash
yarn add @ai-sdk/xai
# or
npm install @ai-sdk/xai
```

## Build and bundling notes

- The package treats `@ai-sdk/xai` as external and optional.
- Consumers who use xAI must install `@ai-sdk/xai` so their bundler can resolve it.
