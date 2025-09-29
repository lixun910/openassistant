import { createId } from './utils';
import { z } from 'zod';
import type React from 'react';
import { AnalysisSessionSchema } from './schemas';
import { ChatStoreState, createSlice } from './store';

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

// Tool type definition
export const AiSliceToolSchema = z.object({
  description: z.string(),
  parameters: z.any(), // z.ZodTypeAny
  execute: z.function().returns(
    z.promise(
      z.object({
        llmResult: z.unknown(),
        additionalData: z.unknown().optional(),
      })
    )
  ),
  component: z.any().optional(), // React.ComponentType
});

export type AiSliceTool = z.infer<typeof AiSliceToolSchema>;

export const AiSliceState = z.object({
  ai: z.object({
    analysisPrompt: z.string(),
    isRunningAnalysis: z.boolean(),
    tools: z.record(z.string(), AiSliceToolSchema),
    analysisAbortController: z.instanceof(AbortController).optional(),
  }),
});

export type AiSliceState = z.infer<typeof AiSliceState>;

export interface AiSliceActions {
  ai: {
    setAnalysisPrompt: (prompt: string) => void;
    startAnalysis: () => Promise<void>;
    cancelAnalysis: () => void;
    setAiModel: (modelProvider: string, model: string) => void;
    createSession: (
      name?: string,
      modelProvider?: string,
      model?: string
    ) => void;
    getCurrentSession: () => AnalysisSessionSchema | undefined;
    findToolComponent: (toolName: string) => React.ComponentType | undefined;
    getApiKeyFromSettings: () => string;
    getBaseUrlFromSettings: () => string | undefined;
    getMaxStepsFromSettings: () => number;
    getInstructionsFromSettings: () => string;
  };
}

/**
 * Configuration options for creating an AI slice
 */
export interface AiSliceOptions {
  /** Initial prompt to display in the analysis input */
  initialAnalysisPrompt?: string;
  /** Custom tools to add to the AI assistant */
  customTools?: Record<string, AiSliceTool>;
  getInstructions?: () => string;
  toolsOptions?: DefaultToolsOptions;
  defaultProvider?: string;
  defaultModel?: string;
  maxSteps?: number;
  getApiKey?: (modelProvider: string) => string;
  getBaseUrl?: () => string;
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
      customTools = {},
      toolsOptions, // eslint-disable-line @typescript-eslint/no-unused-vars
      getApiKey,
      getBaseUrl,
      maxSteps,
      getInstructions,
    } = options;

    return {
      ai: {
        analysisPrompt: initialAnalysisPrompt,
        isRunningAnalysis: false,

        tools: {
          ...customTools,
        },

        setAnalysisPrompt: (prompt: string) => {
          set((state) => ({
            ai: {
              ...state.ai,
              analysisPrompt: prompt,
            },
          }));
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
          set((state) => ({
            config: {
              ...state.config,
              ai: {
                ...state.config.ai,
                sessions: [
                  {
                    id: newSessionId,
                    name: sessionName,
                    modelProvider:
                      modelProvider || currentSession?.modelProvider || 'openai',
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
          }));
        },

        /**
         * Start the analysis
         * TODO: how to pass the history analysisResults?
         */
        startAnalysis: async () => {
          const resultId = createId();
          const abortController = new AbortController();
          const currentSession = get().config.ai.sessions.find(
            (session) => session.id === get().config.ai.currentSessionId
          );

          if (!currentSession) {
            console.error('No current session found');
            return;
          }

          set((state) => ({
            ai: {
              ...state.ai,
              analysisAbortController: abortController,
              isRunningAnalysis: true,
            },
          }));

          const session = get().config.ai.sessions.find(
            (s) => s.id === get().config.ai.currentSessionId
          );

          if (session) {
            session.analysisResults.push({
              id: resultId,
              prompt: get().ai.analysisPrompt,
              response: [
                {
                  type: 'text',
                  text: '',
                },
              ],
              isCompleted: false,
            });
          }

          try {
            // TODO: Implement runAnalysis function
            console.log(
              'Analysis started - runAnalysis function needs to be implemented'
            );
          } catch (err) {
            console.error('Analysis failed:', err);
          } finally {
            set((state) => ({
              ai: {
                ...state.ai,
                isRunningAnalysis: false,
                analysisPrompt: '',
              },
            }));
          }
        },

        cancelAnalysis: () => {
          set((state) => ({
            ai: {
              ...state.ai,
              isRunningAnalysis: false,
            },
          }));
          get().ai.analysisAbortController?.abort('Analysis cancelled');
        },

        findToolComponent: (toolName: string) => {
          return Object.entries(get().ai.tools).find(
            ([name]) => name === toolName
          )?.[1]?.component as React.ComponentType;
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
