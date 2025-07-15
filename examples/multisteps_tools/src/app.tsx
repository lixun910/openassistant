// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { extendedTool } from '@openassistant/utils';
import { AiAssistant } from '@openassistant/ui';
import { z } from 'zod';

type WeatherContext = {
  getStation: (cityName: string) => Promise<string>;
  getTemperature: (cityName: string) => Promise<number>;
};

function isWeatherContext(context: any): context is WeatherContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getStation' in context &&
    'getTemperature' in context
  );
}

function WeatherStation({
  temperature,
  station,
  cityName,
  reason,
}: {
  temperature: number;
  station: string;
  cityName: string;
  reason: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-md border p-2 bg-gray-100">
      <div>{reason}</div>
      <div className="flex flex-row gap-2">
        <div>{cityName}</div>
        <div>{temperature}°F</div>
        <div>Station: {station}</div>
      </div>
    </div>
  );
}

export function App() {
  const tools = {
    temperature: extendedTool({
      description: 'Get the temperature in a city from a weather station',
      parameters: z.object({ cityName: z.string(), reason: z.string() }),
      execute: async ({ cityName, reason }, options) => {
        if (!isWeatherContext(options?.context)) {
          throw new Error('Options are required');
        }
        const getStation = options.context.getStation;
        const station = getStation ? await getStation(cityName) : null;
        const getTemperature = options.context.getTemperature;
        const temperature = getTemperature
          ? await getTemperature(cityName)
          : null;
        return {
          llmResult: {
            success: true,
            text: `The temperature in ${cityName} is ${temperature} degrees from weather station ${station}.`,
          },
          additionalData: {
            cityName,
            temperature,
            station,
            reason,
          },
        };
      },
      context: {
        getStation: async (cityName: string) => {
          const stations = {
            'New York': '123',
            'Los Angeles': '456',
            Chicago: '789',
          };
          return stations[cityName];
        },
        getTemperature: async (cityName: string) => {
          const temperatures = {
            'New York': 70,
            'Los Angeles': 80,
            Chicago: 60,
          };
          return temperatures[cityName];
        },
      },
      component: WeatherStation,
    }),
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Multistep Tools Example</h1>
      <div className="w-[800px] h-[800px] m-4 rounded-lg shadow-lg p-6">
        <AiAssistant
          name="My Assistant"
          apiKey={process.env.OPENAI_API_KEY || ''}
          version="v1"
          modelProvider="openai"
          model="gpt-4o"
          welcomeMessage={`Hello, how can I help you today? Try to ask:
- What is the temperature in New York?
- Is New York hotter than Chicago?
`}
          instructions="You are a helpful assistant. Explain the steps you are taking to solve the user's problem."
          tools={tools}
          useMarkdown={true}
        />
      </div>
    </div>
  );
}
