import React from 'react';
import {
  SessionControls,
  QueryControls,
  AnalysisResultsContainer,
  AiSettingsPanel,
  ModelSelector,
  ChatStoreOptions,
  createChatStore,
  ChatStoreProvider,
} from '@openassistant/chat';
import {
  QueryDuckDBComponent,
  QueryDuckDBOutputData,
} from '@openassistant/tables';
import { dataClassify } from '@openassistant/geoda';
import { Button, useDisclosure } from '@sqlrooms/ui';
import { Settings } from 'lucide-react';
import { localQuery, getDuckDB } from '@openassistant/duckdb';
import { ToolCache } from '@openassistant/utils';
import { keplergl } from '@openassistant/map';
import {
  CreateMapOutputData,
  KeplerGlComponent,
} from '@openassistant/keplergl';
import { AI_SETTINGS } from './config';

// Sample dataset for demonstration
const SAMPLE_DATASETS = {
  venues: [
    { name: 'Golden Gate Park', city: 'San Francisco', rating: 4.5 },
    { name: "Fisherman's Wharf", city: 'San Francisco', rating: 4.2 },
    { name: 'Alcatraz Island', city: 'San Francisco', rating: 4.7 },
  ],
  cities: [
    {
      name: 'San Francisco',
      population: 800000,
      latitude: 37.774929,
      longitude: -122.419416,
    },
    {
      name: 'New York',
      population: 8400000,
      latitude: 40.712776,
      longitude: -74.005974,
    },
    {
      name: 'Los Angeles',
      population: 3900000,
      latitude: 34.052235,
      longitude: -118.243683,
    },
    {
      name: 'Chicago',
      population: 2700000,
      latitude: 41.878114,
      longitude: -87.629798,
    },
    {
      name: 'Houston',
      population: 2300000,
      latitude: 29.760427,
      longitude: -95.369804,
    },
    {
      name: 'Miami',
      population: 600000,
      latitude: 25.76168,
      longitude: -80.19179,
    },
    {
      name: 'Seattle',
      population: 700000,
      latitude: 47.606209,
      longitude: -122.332071,
    },
    {
      name: 'Denver',
      population: 700000,
      latitude: 39.739236,
      longitude: -104.990251,
    },
    {
      name: 'Las Vegas',
      population: 600000,
      latitude: 36.169941,
      longitude: -115.13983,
    },
    {
      name: 'Orlando',
      population: 600000,
      latitude: 28.538335,
      longitude: -81.379236,
    },
    {
      name: 'Philadelphia',
      population: 1500000,
      latitude: 39.952584,
      longitude: -75.165222,
    },
    {
      name: 'Phoenix',
      population: 1600000,
      latitude: 33.448377,
      longitude: -112.074037,
    },
    {
      name: 'San Antonio',
      population: 1500000,
      latitude: 29.424122,
      longitude: -98.493628,
    },
    {
      name: 'San Diego',
      population: 1400000,
      latitude: 32.715738,
      longitude: -117.161084,
    },
    {
      name: 'Dallas',
      population: 1300000,
      latitude: 32.776667,
      longitude: -96.796989,
    },
    {
      name: 'San Jose',
      population: 1000000,
      latitude: 37.338208,
      longitude: -121.886328,
    },
  ],
};

const toolCache = ToolCache.getInstance();

const getValues = async (datasetName: string, variableName: string) => {
  // Get the values of the variable from your dataset
  const dataset = SAMPLE_DATASETS[datasetName as keyof typeof SAMPLE_DATASETS];
  if (!dataset) {
    throw new Error(`Dataset '${datasetName}' not found`);
  }
  return dataset.map((item) => item[variableName as keyof typeof item]);
};

// Create tool with custom context
const localQueryTool = {
  ...localQuery,
  context: { getValues },
  onToolCompleted: (toolCallId: string, additionalData: unknown) => {
    console.log('Query completed:', toolCallId, additionalData);
    toolCache.addDataset(toolCallId, additionalData);
  },
  component: (props: QueryDuckDBOutputData) => {
    return (
      <QueryDuckDBComponent
        {...props}
        getDuckDB={getDuckDB}
        getValues={getValues}
      />
    );
  },
};

const dataClassifyTool = {
  ...dataClassify,
  context: { getValues },
};

const keplerMapTool = {
  ...keplergl,
  context: {
    getDataset: async (datasetName: string) => {
      if (datasetName in SAMPLE_DATASETS) {
        return SAMPLE_DATASETS[datasetName as keyof typeof SAMPLE_DATASETS];
      }
      if (toolCache.hasDataset(datasetName)) {
        return toolCache.getDataset(datasetName);
      }
      throw new Error(`Dataset ${datasetName} not found`);
    },
  },
  component: KeplerGlComponent,
};

export default function Chat() {
  // Create an app-local store instance and provide it via Provider (memoized)
  const useChatStore = React.useMemo(
    () =>
      createChatStore({
        aiSettings: {
          initialSettings: AI_SETTINGS,
        },
        ai: {
          getInstructions: () =>
            `You are a helpful assistant that can answer questions and help with tasks.
Your name is George.
You can use the following datasets to answer the user's question:
- Dataset: venues
 - Fields: name, city, ratin
- Dataset: cities
 - Fields: name, population, latitude, longitude
`,
          tools: {
            [localQueryTool.name]: localQueryTool,
            [dataClassifyTool.name]: dataClassifyTool,
            [keplerMapTool.name]: keplerMapTool,
          },
        },
      }),
    []
  );

  const currentSessionId = useChatStore((s) => s.config.ai.currentSessionId);
  const models = useChatStore((s) => s.config.aiSettings.getModels());
  const settingsPanelOpen = useDisclosure();

  return (
    <ChatStoreProvider store={useChatStore}>
      <div className="flex h-full w-full flex-col gap-0 overflow-hidden p-4">
        <div className="relative mb-4">
          <SessionControls className="mr-8 max-w-[calc(100%-3rem)] overflow-hidden" />
          <Button
            variant="outline"
            className="hover:bg-accent absolute right-0 top-0 flex h-8 w-8 items-center justify-center transition-colors"
            onClick={settingsPanelOpen.onToggle}
            title="Configuration"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {settingsPanelOpen.isOpen ? (
          <div className="flex-grow overflow-auto">
            {currentSessionId && (
              <AiSettingsPanel disclosure={settingsPanelOpen}>
                <AiSettingsPanel.ProvidersSettings />
                <AiSettingsPanel.ModelsSettings />
                <AiSettingsPanel.ModelParametersSettings
                  getDefaultInstructions={() =>
                    useChatStore.getState().ai.getInstructionsFromSettings()
                  }
                />
              </AiSettingsPanel>
            )}
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-auto">
              <AnalysisResultsContainer key={currentSessionId} />
            </div>

            <QueryControls placeholder="">
              <div className="flex items-center justify-end gap-2">
                <ModelSelector models={models} />
              </div>
            </QueryControls>
          </>
        )}
      </div>
    </ChatStoreProvider>
  );
}
