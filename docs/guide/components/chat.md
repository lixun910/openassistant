# Chat Component

The `@openassistant/chat` package provides full-featured chat interface components.

## Installation

```bash
npm install @openassistant/chat
```

## Components

- **ChatContainer** - Main chat message display
- **PromptInput** - Message input field
- **MessageCard** - Individual message display
- **SettingsPanel** - Configuration panel
- **VoiceChatButton** - Voice input control

## Basic Usage

```tsx
import { ChatContainer, PromptInput } from '@openassistant/chat';
import { useChat } from 'ai/react';

export default function MyChat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <ChatContainer messages={messages} />
      </div>
      <PromptInput
        value={input}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
```

## API Reference

For detailed API documentation, see the [Chat API Reference](/api/@openassistant/chat/README).

