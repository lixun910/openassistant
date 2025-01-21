'use client';

import {
  createMapFunctionDefinition,
  GetDatasetForCreateMapFunctionArgs,
} from '@openassistant/keplergl';
import { useMemo, useState } from 'react';
import { MessageModel } from '@openassistant/core';
import { AiAssistant, AiAssistantConfig, ConfigPanel } from '@openassistant/ui';

export default function Assistant({
  screenCaptured,
  setScreenCaptured,
  setStartScreenCapture,
}: {
  screenCaptured: string;
  setScreenCaptured: (screenCaptured: string) => void;
  setStartScreenCapture: (startScreenCapture: boolean) => void;
}) {
  const myDatasets = {
    myVenues: [
      {
        location: 'New York',
        latitude: 40.7128,
        longitude: -74.006,
        revenue: 100000,
        population: 8000000,
      },
      {
        location: 'Los Angeles',
        latitude: 34.0522,
        longitude: -118.2437,
        revenue: 150000,
        population: 4000000,
      },
      {
        location: 'Chicago',
        latitude: 41.8781,
        longitude: -87.6298,
        revenue: 120000,
        population: 2700000,
      },
    ],
  };

  const dataContext = useMemo(() => {
    // Note: you can call your data API to get the meta data of your dataset
    return [
      {
        description:
          'Please use the following meta data for function callings.',
        metaData: [
          {
            datasetName: 'myVenues',
            fields: ['name', 'longitude', 'latitude', 'revenue', 'population'],
          },
        ],
      },
    ];
  }, []);

  const myFunctions = [
    createMapFunctionDefinition({
      getDataset: ({ datasetName }: GetDatasetForCreateMapFunctionArgs) => {
        // check if the dataset exists
        if (!myDatasets[datasetName]) {
          throw new Error('The dataset does not exist.');
        }
        return myDatasets[datasetName];
      },
    }),
  ];

  const [aiConfig, setAiConfig] = useState<AiAssistantConfig>({
    isReady: false,
    provider: 'openai',
    model: 'gpt-4o',
    apiKey: '',
    baseUrl: 'http://127.0.0.1:11434',
    temperature: 0.8,
    topP: 1.0,
  });

  const onAiConfigChange = (config: AiAssistantConfig) => {
    setAiConfig(config);
  };

  const historyMessages: MessageModel[] = [
    {
      message: 'Hello, how can I help you today?',
      direction: 'incoming',
      position: 'single',
    },
    {
      message: 'Can you show me what data I can use in the chat?',
      direction: 'outgoing',
      position: 'single',
    },
    {
      message: `Here is the data you can use in the chat:

dataset: samples
column names:
- latitude (float)
- longtitude (float)
- price (float)
- population (int)

Please select your prefered LLM model and use your API key to start the chat.
      `,
      direction: 'incoming',
      position: 'single',
      payload: (
        <div className="mt-4">
          <ConfigPanel
            initialConfig={aiConfig}
            onConfigChange={onAiConfigChange}
          />
        </div>
      ),
    },
  ];

  const assistantProps = {
    name: 'My AI Assistant',
    description: 'This is my AI assistant',
    version: '1.0.0',
    modelProvider: 'openai',
    model: 'gpt-4o',
    apiKey: process.env.OPENAI_TOKEN || '',
    welcomeMessage: 'Hi, I am your AI assistant',
    instructions: `You are a data analyst. You can help users to analyze data including creating charts, querying data, and creating maps. If a function calling can be used to answer the user's question, please always confirm the function calling and its arguments with the user. 
      ${JSON.stringify(dataContext)}`,
    historyMessages,
    functions: myFunctions,
  };

  return (
    <AiAssistant
      {...assistantProps}
      enableVoice={true}
      enableScreenCapture={true}
      screenCapturedBase64={screenCaptured}
      onScreenshotClick={() => setStartScreenCapture(true)}
      onRemoveScreenshot={() => setScreenCaptured('')}
    />
  );
}
