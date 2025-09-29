import { create, StateCreator } from 'zustand';
import { createAiSettingsSlice, AiSettingsSlice } from './AiSettingsSlice';
import { AiConfigSlice, createAiConfigSlice } from './AiConfigSlice';
import { AiSlice, createAiSlice } from './AiSlice';

// A generic helper to define a slice
export function createSlice<TSlice>(
  initializer: StateCreator<ChatStoreState, [], [], TSlice>
) {
  return initializer;
}

export type ChatStoreState = {
  config: AiSettingsSlice & AiConfigSlice;
} & AiSlice;

export const useChatStore = create<ChatStoreState>()((set, get, store) => ({
  config: {
    ...createAiSettingsSlice(set, get, store),
    ...createAiConfigSlice(set, get, store),
  },
  ...createAiSlice({
    initialAnalysisPrompt: '',
    customTools: {},
  })(set, get, store),
}));
