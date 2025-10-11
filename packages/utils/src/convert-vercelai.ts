/* eslint-disable @typescript-eslint/no-explicit-any */
import { OpenAssistantTool } from './tool';
import { z } from 'zod';

/**
 * Converts an OpenAssistantTool to an AI SDK v5 compatible tool configuration.
 *
 * @param tool - The OpenAssistantTool object to convert
 * @returns A tool configuration object that can be used with the `tool()` function from AI SDK v5
 *
 * @example
 * ```typescript
 * import { tool } from 'ai';
 * import { convertToVercelAiTool } from '@openassistant/utils';
 *
 * const myTool: OpenAssistantTool = {
 *   name: 'my-tool',
 *   description: 'My tool description',
 *   parameters: z.object({ input: z.string() }),
 *   context: {},
 *   execute: async (params) => ({ llmResult: 'result' })
 * };
 * const aiSDKTool = tool(convertToVercelAiTool(myTool));
 *
 * // Use with AI SDK v5
 * const result = await streamText({
 *   model: openai('gpt-4'),
 *   messages,
 *   tools: { myTool: aiSDKTool }
 * });
 * ```
 */
export function convertToVercelAiTool(
  tool: OpenAssistantTool<z.ZodTypeAny, unknown, unknown, unknown>
) {
  // Convert the OpenAssistant tool to AI SDK v5 tool configuration
  return {
    name: tool.name,
    description: tool.description,
    inputSchema: tool.parameters,
    outputSchema: z.object({
      success: z.boolean(),
      result: z.string(),
      error: z.string().optional(),
    }),
    execute: async (
      args: unknown,
      options: {
        toolCallId: string;
        abortSignal?: AbortSignal;
        context?: Record<string, unknown>;
      }
    ) => {
      const { toolCallId } = options;
      try {
        const result = await tool.execute(args, {
          ...options,
          context: { 
            ...(tool.context && typeof tool.context === 'object' ? tool.context : {}), 
            ...options.context 
          },
        });

        const { additionalData, llmResult } = result;

        if (additionalData && toolCallId && tool.onToolCompleted) {
          tool.onToolCompleted(toolCallId, additionalData);
        }

        return {
          success: true,
          result: llmResult as unknown as string,
        };
      } catch (error) {
        console.error(`Execute tool failed: ${error}`);
        return {
          success: false,
          error: `Execute tool failed: ${error}`,
        };
      }
    },
  };
}
