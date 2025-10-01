import React from 'react';
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
  initialized: boolean;
  setInitialized: (initialized: boolean) => void;
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

/**
 * Create a chat store with custom options
 * @param options - The options for creating the chat store
 * @returns The chat store
 */
export const createChatStore = (options: ChatStoreOptions = {}) => {
  return create<ChatStoreState>()(
    persist(
      (set, get, store) => ({
        initialized: false,
        config: {
          ...createAiSettingsSlice(options.aiSettings)(set, get, store),
          ...createAiConfigSlice(set, get, store),
        },
        ...createAiSlice({
          initialAnalysisPrompt: '',
          customTools: {},
          ...options.ai,
        })(set, get, store),
        setInitialized: (initialized) => set({ initialized }),
      }),
      {
        name: 'openassistant-chat-store',
        // Persist only serializable data, not action methods
        partialize: (state) => ({
          persistedConfig: {
            aiSettings: {
              providers: state.config.aiSettings.providers,
              customModels: state.config.aiSettings.customModels,
              modelParameters: state.config.aiSettings.modelParameters,
            },
            ai: {
              sessions: state.config.ai.sessions,
              currentSessionId: state.config.ai.currentSessionId,
            },
          },
        }),
        // Re-apply persisted data via slice actions to preserve methods
        onRehydrateStorage: () => (state, error) => {
          if (error) {
            console.warn('Failed to rehydrate chat store from localStorage:', error);
            return;
          }
          try {
            if (!state) return;
            const persisted = (state as unknown as { persistedConfig?: {
              aiSettings?: {
                providers?: unknown;
                customModels?: unknown;
                modelParameters?: unknown;
              };
              ai?: {
                sessions?: unknown;
                currentSessionId?: unknown;
              };
            } }).persistedConfig;
            if (persisted) {
              if (persisted.aiSettings) {
                state.config.aiSettings.setAiSettingsOptions(
                  persisted.aiSettings as Partial<ChatStoreState['config']['aiSettings']>
                );
              }
              if (persisted.ai) {
                state.config.ai.setAiConfigOptions(
                  persisted.ai as Partial<ChatStoreState['config']['ai']>
                );
              }
            }
          } catch (e) {
            console.warn('Error applying persisted chat config:', e);
          }
        },
      }
    )
  );
};

// Provider pattern support
export type ChatStore = ReturnType<typeof createChatStore>;

// Default singleton store (fallback when no Provider is present)
const defaultChatStore: ChatStore = createChatStore();

// React context to hold an injected store
const ChatStoreContext = React.createContext<ChatStore | null>(null);

/**
 * Provider that injects a chat store. If no store is provided, one is created
 * from optional options and memoized for the lifetime of the provider.
 */
export function ChatStoreProvider(props: {
  children: React.ReactNode;
  store?: ChatStore;
  options?: ChatStoreOptions;
}) {
  const { children, store, options } = props;
  const storeRef = React.useRef<ChatStore>();
  if (!storeRef.current) {
    storeRef.current = store ?? createChatStore(options);
  }
  return React.createElement(
    ChatStoreContext.Provider,
    { value: storeRef.current },
    children
  );
}

/**
 * Context-aware hook. Uses the injected store if available, otherwise falls back
 * to the default singleton store.
 */
export function useChatStore<T>(
  selector: (s: ChatStoreState) => T
): T {
  const injected = React.useContext(ChatStoreContext);
  const bound = injected ?? defaultChatStore;
  // Call the bound zustand hook with selector/equality
  return bound(selector);
}

/**
 * Access the current store API (injected or default) for imperative calls.
 */
export function useChatStoreApi(): ChatStore {
  const injected = React.useContext(ChatStoreContext);
  return injected ?? defaultChatStore;
}

// Export default singleton for backward compatibility where a store instance is needed
export const defaultUseChatStore = defaultChatStore;
