import React from 'react';
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
            additionalData: {
              input,
            },
          };
        },
        context: {},
      },
    },
  },
};

export function App() {
  return (
    <div className="flex h-screen w-screen items-center justify-center p-4">
      <div className="w-full max-w-[900px] h-full">
        <Assistant options={config} />
      </div>
    </div>
  );
}
