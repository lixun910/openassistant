import { createId } from './utils';
import { z } from 'zod';
import { AnalysisSessionSchema } from './schemas';
import { createSlice } from './store';
import { produce } from 'immer';

export const AiConfigState = z.object({
  ai: z.object({
    sessions: z.array(AnalysisSessionSchema),
    currentSessionId: z.string().optional(),
  }),
});
export type AiConfigState = z.infer<typeof AiConfigState>;

export interface AiConfigActions {
  ai: {
    switchSession: (sessionId: string) => void;
    renameSession: (sessionId: string, name: string) => void;
    deleteSession: (sessionId: string) => void;
    deleteAnalysisResult: (sessionId: string, resultId: string) => void;
    setAiConfigOptions: (
      options: Partial<AiConfigState['ai']>
    ) => void;
  };
}

export function createDefaultAiConfig(
  props: Partial<AiConfigState['ai']>
): AiConfigState {
  const defaultSessionId = createId();
  return {
    ai: {
      sessions: [
        {
          id: defaultSessionId,
          name: 'Default Session',
          modelProvider: 'openai',
          model: 'gpt-4.1',
          analysisResults: [],
          createdAt: new Date(),
          uiMessages: [],
          toolAdditionalData: {},
        },
      ],
      currentSessionId: defaultSessionId,
      ...props,
    },
  };
}

export type AiConfigSlice = AiConfigState & AiConfigActions;

export const createAiConfigSlice = createSlice<AiConfigSlice>((set) => ({
  ai: {
    ...createDefaultAiConfig({}).ai,

    setAiConfigOptions: (incoming) => {
      set((state) =>
        produce(state, (draft) => {
          if (!incoming) return;
          if (incoming.sessions) {
            draft.config.ai.sessions = incoming.sessions as unknown as (typeof draft.config.ai.sessions);
          }
          if (incoming.currentSessionId !== undefined) {
            draft.config.ai.currentSessionId = incoming.currentSessionId as string | undefined;
          }
        })
      );
    },

    /**
     * Switch to a different session
     */
    switchSession: (sessionId: string) => {
      set((state) =>
        produce(state, (draft) => {
          draft.config.ai.currentSessionId = sessionId;
        })
      );
    },

    /**
     * Rename an existing session
     */
    renameSession: (sessionId: string, name: string) => {
      set((state) =>
        produce(state, (draft) => {
          const session = draft.config.ai.sessions.find((s) => s.id === sessionId);
          if (session) {
            session.name = name;
          }
        })
      );
    },

    /**
     * Delete a session
     */
    deleteSession: (sessionId: string) => {
      set((state) =>
        produce(state, (draft) => {
          const sessionIndex = draft.config.ai.sessions.findIndex(
            (s) => s.id === sessionId
          );
          if (sessionIndex !== -1) {
            // Don't delete the last session
            if (draft.config.ai.sessions.length > 1) {
              draft.config.ai.sessions.splice(sessionIndex, 1);
              // If we deleted the current session, switch to another one
              if (draft.config.ai.currentSessionId === sessionId) {
                // Make sure there's at least one session before accessing its id
                if (draft.config.ai.sessions.length > 0) {
                  const firstSession = draft.config.ai.sessions[0];
                  if (firstSession) {
                    draft.config.ai.currentSessionId = firstSession.id;
                  }
                }
              }
            }
          }
        })
      );
    },

    /**
     * Delete an analysis result from a session
     */
    deleteAnalysisResult: (sessionId: string, resultId: string) => {
      set((state) =>
        produce(state, (draft) => {
          const session = draft.config.ai.sessions.find((s) => s.id === sessionId);
          if (session) {
            // Remove the UI messages that correspond to this analysis result
            // We need to remove both the user message and the assistant response
            const userMessageIndex = session.uiMessages.findIndex(
              (msg) => msg.id === resultId
            );
            
            if (userMessageIndex !== -1) {
              // Find the corresponding assistant message
              let assistantMessageIndex = -1;
              for (let i = userMessageIndex + 1; i < session.uiMessages.length; i++) {
                if (session.uiMessages[i]?.role === 'assistant') {
                  assistantMessageIndex = i;
                  break;
                } else if (session.uiMessages[i]?.role === 'user') {
                  // Stop at next user message
                  break;
                }
              }
              
              // Remove messages (assistant first to maintain indices)
              if (assistantMessageIndex !== -1) {
                session.uiMessages.splice(assistantMessageIndex, 1);
              }
              session.uiMessages.splice(userMessageIndex, 1);
            }
            
            // Also remove from analysisResults if it exists there
            session.analysisResults = session.analysisResults.filter(
              (r) => r.id !== resultId
            );
          }
        })
      );
    },
  },
}));
