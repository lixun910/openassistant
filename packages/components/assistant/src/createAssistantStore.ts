import { AiSliceState, createAiSlice } from '@sqlrooms/ai-core';
import type { AiSliceTool } from '@sqlrooms/ai-core';
import {
  AiSettingsSliceState,
  createAiSettingsSlice,
} from '@sqlrooms/ai-settings';
import type { AiSettingsSliceConfig } from '@sqlrooms/ai-config';
import {
  BaseRoomConfig,
  createRoomSlice,
  createRoomStore,
  RoomState,
  StateCreator,
} from '@sqlrooms/room-store';
import { persist } from 'zustand/middleware';
import { AI_SETTINGS } from './config';

type CombinedState = RoomState<BaseRoomConfig> & AiSliceState & AiSettingsSliceState;

export type AssistantOptions = {
  aiSettings?: {
    initialSettings?: Pick<AiSettingsSliceConfig, 'providers'>;
  };
  ai: {
    getInstructions: () => string;
    tools?: unknown;
  };
  persistKey?: string;
};

/**
 * Create a reusable AI assistant store that composes base room, settings, and AI slices.
 */
export function createAssistantStore(options: AssistantOptions) {
  const persistKey = options.persistKey || 'openassistant-ai-state-storage';
  const initialSettings =
    options.aiSettings?.initialSettings || (AI_SETTINGS as Pick<AiSettingsSliceConfig, 'providers'>);

  // Convert tools to proper format by adding name from key
  const convertedTools = Object.entries(options.ai.tools || {}).reduce((acc, [name, tool]) => {
    acc[name] = {
      name,
      ...tool,
    } as unknown as AiSliceTool;
    return acc;
  }, {} as Record<string, AiSliceTool>);

  const creator: StateCreator<CombinedState> = (set, get, store) => ({
    // Base room slice
    ...createRoomSlice<BaseRoomConfig>()(set, get, store),

    // AI model configuration slice
    ...createAiSettingsSlice({ config: initialSettings })(set, get, store),

    // AI slice
    ...createAiSlice({
      getInstructions: options.ai.getInstructions,
      tools: convertedTools,
    })(set, get, store),
  });

  const persistedCreator = persist(creator, {
    name: persistKey,
    partialize: (state) => ({
      // Persist raw config objects without schema parsing to avoid cross-version zod issues
      ai: state.ai.config,
      aiSettings: state.aiSettings.config,
    }),
    merge: (persistedState: unknown, currentState) => {
      const safe = (persistedState as { ai?: unknown; aiSettings?: unknown }) || {};
      return {
        ...currentState,
        ai: {
          ...currentState.ai,
          // Trust persisted config structure; validation can be added by consumers if needed
          config: (safe.ai as CombinedState['ai']['config']) ?? currentState.ai.config,
        },
        aiSettings: {
          ...currentState.aiSettings,
          config:
            (safe.aiSettings as CombinedState['aiSettings']['config']) ??
            currentState.aiSettings.config,
        },
      };
    },
  }) as StateCreator<CombinedState>;

  return createRoomStore<BaseRoomConfig, CombinedState>(persistedCreator);
}


