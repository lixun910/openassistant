import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import { createAiSettingsSlice, AiSettingsSlice, AiSettingsSliceOptions } from './AiSettingsSlice';
import { AiConfigSlice, createAiConfigSlice } from './AiConfigSlice';
import { AiSlice, createAiSlice, AiSliceOptions } from './AiSlice';

// A generic helper to define a slice
export function createSlice<TSlice>(
  initializer: StateCreator<ChatStoreState, [], [], TSlice>
) {
  return initializer;
}

export type ChatStoreState = {
  config: AiSettingsSlice & AiConfigSlice;
} & AiSlice;

/**
 * Configuration options for creating a chat store
 */
export interface ChatStoreOptions {
  /** AI settings options */
  aiSettings?: AiSettingsSliceOptions;
  /** AI slice options */
  ai?: AiSliceOptions;
}

// Global store instance - will be created lazily
let globalStore: ReturnType<typeof createChatStore> | null = null;
let globalStoreOptions: ChatStoreOptions = {};

/**
 * Create a chat store with custom options
 * @param options - The options for creating the chat store
 * @returns The chat store
 */
export const createChatStore = (options: ChatStoreOptions = {}) => {
  return create<ChatStoreState>()(
    persist(
      (set, get, store) => ({
        config: {
          ...createAiSettingsSlice(options.aiSettings)(set, get, store),
          ...createAiConfigSlice(set, get, store),
        },
        ...createAiSlice({
          initialAnalysisPrompt: '',
          customTools: {},
          ...options.ai,
        })(set, get, store),
      }),
      {
        name: 'openassistant-chat-store',
        // Only persist the config part, not the AI slice state (messages, sessions, etc.)
        partialize: (state) => ({
          config: state.config,
        }),
        // Add error handling for localStorage operations
        onRehydrateStorage: () => (state, error) => {
          if (error) {
            console.warn('Failed to rehydrate chat store from localStorage:', error);
          }
        },
      }
    )
  );
};

/**
 * Initialize the global store with options
 * This should be called once at application startup
 * @param options - The options for creating the chat store
 */
export const initializeChatStore = (options: ChatStoreOptions = {}) => {
  globalStoreOptions = options;
  globalStore = createChatStore(options);
  return globalStore;
};

/**
 * Get the global chat store
 * If not initialized, creates one with default options
 * @returns The global chat store
 */
export const getChatStore = () => {
  if (!globalStore) {
    globalStore = createChatStore(globalStoreOptions);
  }
  return globalStore;
};

/**
 * Hook to use the chat store
 * This will always return the properly configured global store
 * @returns The chat store hook
 */
export const useChatStore = () => {
  return getChatStore();
};
