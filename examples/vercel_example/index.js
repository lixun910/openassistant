// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import dotenv from 'dotenv';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { histogram } from '@openassistant/plots';
import { convertToVercelAiTool } from '@openassistant/utils';

// Load environment variables
dotenv.config();

const key = process.env.OPENAI_API_KEY;

async function main() {
  // Register a simple calculator tool
  const context = {
    getValues: (datasetName, variableName) => {
      console.log('getValues', datasetName, variableName);
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    },
  };
  const onToolCompleted = (toolCallId, additionalData) => {
    console.log('toolCallId', toolCallId);
    console.log('additionalData', additionalData);
  };

  const histogramTool = {
    ...histogram,
    context,
    onToolCompleted,
  };

  // use tool in vercel ai
  const model = openai('gpt-4o', { apiKey: key });

  const result = await generateText({
    model,
    system:
      'You are a helpful assistant that can use tools to get information. Please make a plan before using tools.',
    prompt: 'create a histogram of HR60 in dataset Natregimes',
    tools: {
      histogram: convertToVercelAiTool(histogramTool),
    },
  });

  console.log(result);
}

main().catch(console.error);
