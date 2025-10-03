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
import { QueryDuckDBComponent } from '@openassistant/tables';
import { Button, useDisclosure } from '@sqlrooms/ui';
import { Settings } from 'lucide-react';
import { LocalQueryTool } from '@openassistant/duckdb';
import { tool } from 'ai';
import { AI_SETTINGS } from './config';

// Removed local buildModels in favor of store-derived models

// Sample dataset for demonstration
const SAMPLE_DATASETS = {
  venues: [
    { name: 'Golden Gate Park', city: 'San Francisco', rating: 4.5 },
    { name: "Fisherman's Wharf", city: 'San Francisco', rating: 4.2 },
    { name: 'Alcatraz Island', city: 'San Francisco', rating: 4.7 },
  ],
};

// Create tool with custom context
const localQueryTool = new LocalQueryTool({
  context: {
    getValues: async (datasetName: string, variableName: string) => {
      // Get the values of the variable from your dataset
      const dataset =
        SAMPLE_DATASETS[datasetName as keyof typeof SAMPLE_DATASETS];
      if (!dataset) {
        throw new Error(`Dataset '${datasetName}' not found`);
      }
      return dataset.map((item) => item[variableName as keyof typeof item]);
    },
  },
  onToolCompleted: (toolCallId, additionalData) => {
    console.log('Query completed:', toolCallId, additionalData);
  },
  component: QueryDuckDBComponent,
});

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
            "You are a helpful assistant that can answer questions and help with tasks. Your name is George. You can use the following datasets to answer the user's question: \nDatasetName: venues, \nFields: name, city, rating",
          tools: { localQuery: localQueryTool.toVercelAiTool(tool) },
          // toolComponent: { localQuery: QueryDuckDBComponent },
        },
      } as ChatStoreOptions),
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
