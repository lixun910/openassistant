# React-AI-Assist Chat UI Components CLI

A CLI tool to add React-AI-Assist chat UI components to your React project. You can adjust the components to your own project.

## Installation

```bash
npx add-ai-chat
```

## Usage

The CLI will prompt you for:

- Target directory for the components
- Whether you're using TypeScript

## Requirements

Your project should have these dependencies:

- react
- react-ai-assist
- tailwindcss
- @nextui-org/react
- framer-motion
- @iconify/react
- next-themes
- html2canvas

## Components Added

- AiAssistant
- ScreenshotWrapper

## Example Usage

```jsx
jsx;
import { AiAssistant } from './components/assistant';
function App() {
  return (
    <AiAssistant
      modelProvider="openai"
      model="gpt-4"
      apiKey="your-api-key"
      welcomeMessage="Hello! How can I help you today?"
    />
  );
}
```
