import { createAssistantStore } from './createAssistantStore';

export const { roomStore, useRoomStore } = createAssistantStore({
  ai: {
    // Provide a minimal default; apps should pass their own via Assistant options
    getInstructions: () => 'You are an AI assistant.',
    tools: {},
  },
});
