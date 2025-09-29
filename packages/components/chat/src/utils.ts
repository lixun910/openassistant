/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tool } from 'ai';
import { AiSliceTool } from './AiSlice';

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncates text to a specified word limit
 */
export function truncate(text: string, wordLimit: number): string {
  if (!text) return text;

  const words = text.split(' ');
  if (words.length <= wordLimit) return text;

  return words.slice(0, wordLimit).join(' ') + '...';
}

/**
 * Gets a user-friendly error message for display
 */
export function getErrorMessageForDisplay(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }

  return 'An unknown error occurred';
}

/**
 * Creates a unique ID using a simple approach
 * This replaces the need for @paralleldrive/cuid2
 */
export function createId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function convertToVercelAiTool({
  tool,
  onToolCompleted,
}: {
  tool: AiSliceTool;
  onToolCompleted: (toolCallId: string, additionalData: unknown) => void;
}): Tool {
  const vercelAiTool = {
    description: tool.description,
    inputSchema: tool.parameters,
    // outputSchema: tool.outputSchema,
    execute: async (args: Record<string, unknown>, options: any) => {
      const result = await tool.execute(args as unknown, {
        ...options,
        context: tool.context,
      });

      if (onToolCompleted) {
        onToolCompleted(options.toolCallId, result.additionalData);
      }

      return result.llmResult;
    },
  };
  return vercelAiTool;
}
