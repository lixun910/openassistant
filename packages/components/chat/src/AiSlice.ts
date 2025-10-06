import { createId } from './utils';
import { z } from 'zod';
import { AnalysisResultSchema, AnalysisSessionSchema } from './schemas';
import { ChatStoreState, createSlice } from './store';
import { DefaultChatTransport, UIMessage } from 'ai';
import { UIMessagePart } from './schema/UIMessageSchema';
import { produce } from 'immer';
import {
  createChatHandlers,
  createLocalChatTransportFactory,
  createRemoteChatTransportFactory,
  LlmDeps,
} from './llm';
import { OpenAssistantToolSet } from '@openassistant/utils';

export type DefaultToolsOptions = {
  /**
   * Whether to enable read only mode (default: true)
   */
  readOnly?: boolean;
  /**
   * Number of rows to share with LLM (default: 0)
   */

  numberOfRowsToShareWithLLM?: number;
  /**
   * Whether to automatically generate a summary of the query result (default: true)
   */
  autoSummary?: boolean;
};

export const AiSliceState = z.object({
  ai: z.object({
    analysisPrompt: z.string(),
    isRunningAnalysis: z.boolean(),
    tools: z.record(z.string(), z.any()),
    analysisAbortController: z.instanceof(AbortController).optional(),
    /** Optional remote endpoint to use for chat; if empty, local transport is used */
    endPoint: z.string().optional(),
    /** Optional headers to send with remote endpoint */
    headers: z.record(z.string(), z.string()).optional(),
  }),
});

export type AiSliceState = z.infer<typeof AiSliceState>;

export interface AiSliceActions {
  ai: {
    setAnalysisPrompt: (prompt: string) => void;
    setAiOptions: (
      options: Partial<
        Pick<
          AiSliceState['ai'],
          'analysisPrompt' | 'tools' | 'endPoint' | 'headers'
        >
      >
    ) => void;
    startAnalysis: (
      sendMessage: (message: { text: string }) => void
    ) => Promise<void>;
    cancelAnalysis: () => void;
    setAiModel: (modelProvider: string, model: string) => void;
    createSession: (
      name?: string,
      modelProvider?: string,
      model?: string
    ) => void;
    getCurrentSession: () => AnalysisSessionSchema | undefined;
    findToolComponent: (toolName: string) => unknown | undefined;
    getApiKeyFromSettings: () => string;
    getBaseUrlFromSettings: () => string | undefined;
    getMaxStepsFromSettings: () => number;
    getInstructionsFromSettings: () => string;
    // AI SDK v5
    getAnalysisResults: () => AnalysisResultSchema[];
    setSessionUiMessages: (sessionId: string, uiMessages: UIMessage[]) => void;
    setSessionToolAdditionalData: (
      sessionId: string,
      updater:
        | Record<string, unknown>
        | ((prev: Record<string, unknown>) => Record<string, unknown>)
    ) => void;
    getLocalChatTransport: () => DefaultChatTransport<UIMessage>;
    getRemoteChatTransport: (
      endpoint: string,
      headers?: Record<string, string>
    ) => DefaultChatTransport<UIMessage>;
    onChatToolCall: (args: { toolCall: unknown }) => Promise<void> | void;
    onChatFinish: (args: {
      message: UIMessage;
      messages: UIMessage[];
      isError?: boolean;
    }) => void;
    onChatError: (error: unknown) => void;
  };
}

/**
 * Configuration options for creating an AI slice
 */
export interface AiSliceOptions {
  initialAnalysisPrompt?: string;
  tools?: OpenAssistantToolSet;
  getInstructions?: () => string;
  toolsOptions?: DefaultToolsOptions;
  defaultProvider?: string;
  defaultModel?: string;
  maxSteps?: number;
  getApiKey?: (modelProvider: string) => string;
  getBaseUrl?: () => string;
  getModelClientForProvider?: LlmDeps['getModelClientForProvider'];
}

export type AiSlice = {
  ai: AiSliceState['ai'] & AiSliceActions['ai'];
};

/**
 * Create an AI slice
 * @param options - The options for creating the AI slice
 * @returns The AI slice
 */
export const createAiSlice = (options: AiSliceOptions) =>
  createSlice<AiSlice>((set, get) => {
    const {
      defaultProvider = 'openai',
      defaultModel = 'gpt-4.1', // eslint-disable-line @typescript-eslint/no-unused-vars
      initialAnalysisPrompt = '',
      tools = {},
      toolsOptions, // eslint-disable-line @typescript-eslint/no-unused-vars
      getApiKey,
      getBaseUrl,
      maxSteps,
      getInstructions,
      getModelClientForProvider,
    } = options;

    return {
      ai: {
        analysisPrompt: initialAnalysisPrompt,
        isRunningAnalysis: false,
        tools,
        setAiOptions: (incoming) => {
          set(
            (state): Partial<ChatStoreState> =>
              produce(state, (draft) => {
                if (!incoming) return;
                if (incoming.analysisPrompt !== undefined) {
                  draft.ai.analysisPrompt = incoming.analysisPrompt as string;
                }
                if (incoming.tools) {
                  draft.ai.tools = {
                    ...draft.ai.tools,
                    ...incoming.tools,
                  } as typeof draft.ai.tools;
                }
                if (incoming.endPoint !== undefined) {
                  draft.ai.endPoint = incoming.endPoint as string | undefined;
                }
                if (incoming.headers !== undefined) {
                  draft.ai.headers = incoming.headers as
                    | Record<string, string>
                    | undefined;
                }
              })
          );
        },

        setAnalysisPrompt: (prompt: string) => {
          set(
            (state): Partial<ChatStoreState> => ({
              ai: {
                ...state.ai,
                analysisPrompt: prompt,
              },
            })
          );
        },

        /**
         * Set the AI model for the current session
         * @param model - The model to set
         */
        setAiModel: (modelProvider: string, model: string) => {
          const currentSession = getCurrentSessionFromState(get());
          if (currentSession) {
            currentSession.modelProvider = modelProvider;
            currentSession.model = model;
          }
        },

        /**
         * Get the current active session
         */
        getCurrentSession: () => {
          const { currentSessionId, sessions } = get().config.ai;
          return sessions.find((session) => session.id === currentSessionId);
        },

        /**
         * Create a new session with the given name and model settings
         */
        createSession: (
          name?: string,
          modelProvider?: string,
          model?: string
        ) => {
          const currentSession = get().config.ai.sessions.find(
            (session) => session.id === get().config.ai.currentSessionId
          );
          const newSessionId = createId();

          // Generate a default name if none is provided
          let sessionName = name;
          if (!sessionName) {
            // Generate a human-readable date and time for the session name
            const now = new Date();
            const formattedDate = now.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const formattedTime = now.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            });
            sessionName = `Session ${formattedDate} at ${formattedTime}`;
          }

          // Add to AI sessions
          set(
            (state): Partial<ChatStoreState> => ({
              config: {
                ...state.config,
                ai: {
                  ...state.config.ai,
                  sessions: [
                    {
                      id: newSessionId,
                      name: sessionName as string,
                      modelProvider:
                        modelProvider ||
                        currentSession?.modelProvider ||
                        'openai',
                      model: model || currentSession?.model || 'gpt-4.1',
                      analysisResults: [],
                      uiMessages: [],
                      createdAt: new Date(),
                    },
                    ...state.config.ai.sessions,
                  ],
                  currentSessionId: newSessionId,
                },
              },
            })
          );
        },

        /**
         * Start the analysis
         * TODO: how to pass the history analysisResults?
         */
        startAnalysis: async (
          sendMessage: (message: { text: string }) => void
        ) => {
          const currentSession = get().ai.getCurrentSession();
          if (!currentSession) {
            console.error('No current session found');
            return;
          }

          set(
            (state): Partial<ChatStoreState> =>
              produce(state, (draft) => {
                // mark running and create controller
                draft.ai.isRunningAnalysis = true;
                draft.ai.analysisAbortController = new AbortController();
              })
          );

          // Delegate to chat hook; lifecycle managed by onChatFinish/onChatError
          // Analysis result will be created in onChatFinish with the correct message ID
          sendMessage({ text: get().ai.analysisPrompt });
        },

        cancelAnalysis: () => {
          set(
            (state): Partial<ChatStoreState> => ({
              ai: {
                ...state.ai,
                isRunningAnalysis: false,
              },
            })
          );
          get().ai.analysisAbortController?.abort('Analysis cancelled');
        },

        findToolComponent: (toolName: string) => {
          const map = get().ai.tools as OpenAssistantToolSet;
          const tool = map[toolName];
          return tool?.component;
        },

        getBaseUrlFromSettings: () => {
          // First try the getBaseUrl function if provided
          const baseUrlFromFunction = getBaseUrl?.();
          if (baseUrlFromFunction) {
            return baseUrlFromFunction;
          }

          // Fall back to settings
          const currentSession = getCurrentSessionFromState(get());
          if (currentSession) {
            if (currentSession.modelProvider === 'custom') {
              const customModel = get().config.aiSettings.customModels.find(
                (m: { modelName: string }) =>
                  m.modelName === currentSession.model
              );
              return customModel?.baseUrl;
            }
            const provider =
              get().config.aiSettings.providers[currentSession.modelProvider];
            return provider?.baseUrl;
          }
          return undefined;
        },

        getApiKeyFromSettings: () => {
          const currentSession = getCurrentSessionFromState(get());
          if (currentSession) {
            // First try the getApiKey function if provided
            const apiKeyFromFunction = getApiKey?.(
              currentSession.modelProvider || defaultProvider
            );
            if (apiKeyFromFunction) {
              return apiKeyFromFunction;
            }

            // Fall back to settings
            if (currentSession.modelProvider === 'custom') {
              const customModel = get().config.aiSettings.customModels.find(
                (m: { modelName: string }) =>
                  m.modelName === currentSession.model
              );
              return customModel?.apiKey || '';
            } else {
              const provider =
                get().config.aiSettings.providers?.[
                  currentSession.modelProvider
                ];
              return provider?.apiKey || '';
            }
          }
          return '';
        },

        getMaxStepsFromSettings: () => {
          // First try the maxSteps parameter if provided
          if (maxSteps && Number.isFinite(maxSteps) && maxSteps > 0) {
            return maxSteps;
          }

          // Fall back to settings
          const settingsMaxSteps =
            get().config.aiSettings.modelParameters.maxSteps;
          if (Number.isFinite(settingsMaxSteps) && settingsMaxSteps > 0) {
            return settingsMaxSteps;
          }
          return 5;
        },

        getInstructionsFromSettings: () => {
          // First try the getInstructions function if provided
          let instructions = '';
          if (getInstructions) {
            instructions = getInstructions();
          }

          // get additional instructions from settings
          const customInstructions =
            get().config.aiSettings.modelParameters.additionalInstruction;
          if (customInstructions) {
            instructions = `${instructions}\n\nAdditional Instructions:\n\n${customInstructions}`;
          }

          return instructions;
        },

        setSessionUiMessages: (sessionId: string, uiMessages: UIMessage[]) => {
          set(
            (state): Partial<ChatStoreState> =>
              produce(state, (draft) => {
                const session = draft.config.ai.sessions.find(
                  (s) => s.id === sessionId
                );
                if (session) {
                  // store the latest UI messages from the chat hook
                  // Create a deep copy to avoid read-only property issues
                  session.uiMessages = JSON.parse(JSON.stringify(uiMessages));
                }
              })
          );
        },

        setSessionToolAdditionalData: (
          sessionId: string,
          updater:
            | Record<string, unknown>
            | ((prev: Record<string, unknown>) => Record<string, unknown>)
        ) => {
          set(
            (state): Partial<ChatStoreState> =>
              produce(state, (draft) => {
                const session = draft.config.ai.sessions.find(
                  (s) => s.id === sessionId
                );
                if (session) {
                  const prev = session.toolAdditionalData || {};
                  session.toolAdditionalData =
                    typeof updater === 'function'
                      ? (
                          updater as (
                            p: Record<string, unknown>
                          ) => Record<string, unknown>
                        )(prev)
                      : updater;
                }
              })
          );
        },

        /**
         * Get analysis results from the current session's UI messages
         */
        getAnalysisResults: (): AnalysisResultSchema[] => {
          const currentSession = get().ai.getCurrentSession();
          if (!currentSession?.uiMessages?.length) return [];

          const results: AnalysisResultSchema[] = [];
          let i = 0;

          while (i < currentSession.uiMessages.length) {
            const userMessage = currentSession.uiMessages[i];

            // Skip non-user messages
            if (!userMessage || userMessage.role !== 'user') {
              i++;
              continue;
            }

            // Extract user prompt text
            const prompt = userMessage.parts
              .filter(
                (part): part is { type: 'text'; text: string } =>
                  part.type === 'text'
              )
              .map((part) => part.text)
              .join('');

            // Find the assistant response
            let response: UIMessagePart[] = [];
            let isCompleted = false;
            let nextIndex = i + 1;

            for (let j = i + 1; j < currentSession.uiMessages.length; j++) {
              const nextMessage = currentSession.uiMessages[j];
              if (!nextMessage) continue;

              if (nextMessage.role === 'assistant') {
                response = nextMessage.parts;
                isCompleted = true;
                nextIndex = j + 1; // Skip past the assistant message
                break;
              } else if (nextMessage.role === 'user') {
                // Stop at next user message
                nextIndex = j;
                break;
              }
            }

            // Check if there's a related item in currentSession.analysisResults
            const relatedAnalysisResult = currentSession.analysisResults?.find(
              (result) => result.id === (userMessage.id as string)
            );

            results.push({
              id: userMessage.id as string,
              prompt,
              response,
              errorMessage: relatedAnalysisResult?.errorMessage,
              isCompleted,
            });

            i = nextIndex;
          }

          return results;
        },

        getLocalChatTransport: () =>
          createLocalChatTransportFactory({
            get,
            defaultProvider,
            defaultModel,
            apiKey: get().ai.getApiKeyFromSettings(),
            baseUrl: get().ai.getBaseUrlFromSettings(),
            instructions: get().ai.getInstructionsFromSettings(),
            getModelClientForProvider,
          })(),

        getRemoteChatTransport: (
          endpoint: string,
          headers?: Record<string, string>
        ) => createRemoteChatTransportFactory()(endpoint, headers),

        ...createChatHandlers({ get, set }),
      },
    };
  });

/**
 * Helper function to get the current session from state
 */
function getCurrentSessionFromState(
  store: ChatStoreState
): AnalysisSessionSchema | undefined {
  const { currentSessionId, sessions } = store.config.ai;
  return sessions.find((session) => session.id === currentSessionId);
}
