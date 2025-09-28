// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { LocalQueryTool } from '@openassistant/duckdb';
import { createOpenAI } from '@ai-sdk/openai';
import {
  tool,
  convertToModelMessages,
  DefaultChatTransport,
  streamText,
  UIMessagePart,
  lastAssistantMessageIsCompleteWithToolCalls,
  Tool,
} from 'ai';
import { MessageParts } from './components/parts';

const systemPrompt = `You are a helpful assistant that can answer questions and help with tasks. 
You can use the following datasets:
- datasetName: natregimes
- variables: [HR60, PO60]
`;

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default function Home() {
  const [input, setInput] = useState('');

  const [toolAdditionalData, setToolAdditionalData] = useState<
    Record<string, unknown>
  >({});

  const onToolCompleted = (toolCallId: string, additionalData: unknown) => {
    console.log('onToolCompleted', toolCallId, additionalData);
    setToolAdditionalData((prev) => ({
      ...prev,
      [toolCallId]: additionalData,
    }));
  };

  const getValues = async (datasetName: string, variableName: string) => {
    console.log('getValues', datasetName, variableName);
    // simulate return values
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  };

  const localQueryTool = new LocalQueryTool({
    context: {
      getValues,
    },
    onToolCompleted,
  });

  const tools = { localQuery: localQueryTool.toVercelAiTool(tool) };

  // Custom fetch function that handles the AI processing locally
  const customFetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
    const m = JSON.parse(init?.body as string);

    const result = streamText({
      model: openai('gpt-4.1'),
      messages: convertToModelMessages(m.messages),
      tools,
      system: systemPrompt,
      abortSignal: init?.signal as AbortSignal | undefined,
    });
    return result.toUIMessageStreamResponse();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const { error, messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: customFetch,
    }),
    // local tools are handled by the client
    onToolCall: async ({ toolCall }) => {},
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Client-Only Chat Example</h1>
          <p className="text-gray-600">
            This example uses useChat with transport instead of API routes. Try
            asking `what are the top 4 values of HR60?`
          </p>
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              Error: {error.message}
            </div>
          )}
        </div>

        <div className="border rounded-lg p-4 mb-4 h-[400px] overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.role === 'assistant' ? 'text-blue-600' : 'text-gray-800'
              }`}
            >
              <div className="font-semibold mb-1">
                {message.role === 'assistant' ? 'Assistant' : 'You'}:
              </div>
              <MessageParts
                parts={message.parts as Array<UIMessagePart<any, any>>}
                toolAdditionalData={toolAdditionalData}
                getValues={getValues}
              />
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask for a chart visualization..."
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
