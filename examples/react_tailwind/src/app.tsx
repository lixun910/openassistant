import React from 'react';
import { AiAssistant } from '@openassistant/ui';

export function App() {
  return (
    <div className="w-[400px] h-[800px] m-4">
      <AiAssistant
        name="My Assistant"
        apiKey=""
        version="v1"
        modelProvider="ollama"
        model="llama3.1"
        baseUrl="http://127.0.0.1:11434"
        welcomeMessage="Hello, how can I help you today?"
        instructions="You are a helpful assistant."
        functions={[]}
      />
    </div>
  );
}
