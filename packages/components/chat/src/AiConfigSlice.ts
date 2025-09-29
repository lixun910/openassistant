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
          uiMessages: [],
          createdAt: new Date(),
        },
      ],
      currentSessionId: defaultSessionId,
      ...props,
    },
  };
}

export type AiConfigSlice = AiConfigState & AiConfigActions;

export const createAiConfigSlice = createSlice<AiConfigSlice>((set, get) => ({
  ai: {
    ...createDefaultAiConfig({}).ai,

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
      const session = get().config.ai.sessions.find((s) => s.id === sessionId);
      if (session) {
        session.name = name;
      }
    },

    /**
     * Delete a session
     */
    deleteSession: (sessionId: string) => {
      const sessionIndex = get().config.ai.sessions.findIndex(
        (s) => s.id === sessionId
      );
      if (sessionIndex !== -1) {
        // Don't delete the last session
        if (get().config.ai.sessions.length > 1) {
          get().config.ai.sessions.splice(sessionIndex, 1);
          // If we deleted the current session, switch to another one
          if (get().config.ai.currentSessionId === sessionId) {
            // Make sure there's at least one session before accessing its id
            if (get().config.ai.sessions.length > 0) {
              const firstSession = get().config.ai.sessions[0];
              if (firstSession) {
                get().config.ai.currentSessionId = firstSession.id;
              }
            }
          }
        }
      }
    },

    /**
     * Delete an analysis result from a session
     */
    deleteAnalysisResult: (sessionId: string, resultId: string) => {
      const session = get().config.ai.sessions.find((s) => s.id === sessionId);
      if (session) {
        session.analysisResults = session.analysisResults.filter(
          (r) => r.id !== resultId
        );
      }
    },
  },
}));
