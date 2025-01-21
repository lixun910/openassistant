---
sidebar_position: 1
---

# 1. Assistant UI

Quick start to add assistant UI to your app.

## Install

```bash
yarn add @openassistant/core @openassistant/ui @nextui-org/react framer-motion
```

## Add UI Component

You can add assistant UI component to your app by importing `Assistant` component from `@openassistant/ui`.

```tsx
import {AiAssistant} from '@openassistant/ui';
// only for React app without tailwindcss
import '@openassistant/ui/dist/index.css';

export default function MyAssistant() {

  const assistantProps = {
    name: 'My AI Assistant',
    description: 'This is my AI assistant',
    version: '1.0.0',
    modelProvider: 'openai',
    model: 'gpt-4',
    apiKey: 'your-api-key',
    welcomeMessage: 'Hi, I am your AI assistant',
    instructions:
      "You are a data analyst. You can help users to analyze data including creating charts, querying data, and creating maps. If a function calling can be used to answer the user's question, please always confirm the function calling and its arguments with the user.",
    functions: [],
  };

  return <Assistant {...assistantProps} />;
}
```

### Work with TailwindCSS

If you are using TailwindCSS, you can add the following code to your `tailwind.config.js` file to enable the assistant UI styles.

```js
import { nextui } from '@nextui-org/react';

module.exports = {
  content: [
    // your original content
    './node_modules/@openassistant/ui/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  plugins: [nextui()],
};
```

### Work with Next.js

The openassistant UI is built with React, so it can be used in Next.js. However, the current implementation of the openassistant UI requires to be rendered in the client side only.

To use the openassistant UI in Next.js, you need to use the `use client` directive in the component that uses the openassistant UI.

```tsx
'use client';

import { AiAssistant } from '@openassistant/ui';
```


