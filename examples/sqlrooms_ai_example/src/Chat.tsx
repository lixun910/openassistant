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
  useChatStore,
} from '@openassistant/chat';
import { Button, useDisclosure } from '@sqlrooms/ui';
import { Settings } from 'lucide-react';
import { AI_SETTINGS } from './config';

type Model = { provider: string; label: string; value: string };

function buildModels(
  providers: Record<string, { models: { modelName: string }[] }>,
  customModels: { modelName: string }[]
): Model[] {
  const models: Model[] = [];
  Object.entries(providers).forEach(([provider, cfg]) => {
    cfg.models.forEach((m) => {
      models.push({
        provider,
        label: `${provider}:${m.modelName}`,
        value: m.modelName,
      });
    });
  });
  customModels.forEach((m) => {
    models.push({
      provider: 'custom',
      label: `custom:${m.modelName}`,
      value: m.modelName,
    });
  });
  return models;
}

export default function Chat() {
  // Create an app-local store instance and provide it via Provider
  const useChatStore = createChatStore({
    aiSettings: {
      initialSettings: AI_SETTINGS,
    },
  } as ChatStoreOptions);

  const currentSessionId = useChatStore((s) => s.config.ai.currentSessionId);
  const providers = useChatStore((s) => s.config.aiSettings.providers);
  const customModels = useChatStore((s) => s.config.aiSettings.customModels);
  const models = React.useMemo(
    () => buildModels(providers, customModels),
    [providers, customModels]
  );
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

            <QueryControls placeholder="Type here what would you like to learn about the data? Something like 'What is the max magnitude of the earthquakes by year?'">
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
