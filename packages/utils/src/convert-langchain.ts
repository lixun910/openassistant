import { type OpenAssistantTool, type OpenAssistantExecuteFunctionResult } from "./tool";
import { z } from 'zod';

/**
 * Converts an OpenAssistantTool to a LangChain-compatible tool configuration.
 * 
 * @param tool - The OpenAssistantTool object to convert
 * @returns A tool configuration object that can be used with the `tool()` function from LangChain
 * 
 * @example
 * ```typescript
 * import { tool } from '@langchain/core/tools';
 * import { convertToLangchainTool } from '@openassistant/utils';
 * 
 * const myTool: OpenAssistantTool = {
 *   name: 'my-tool',
 *   description: 'My tool description',
 *   parameters: z.object({ input: z.string() }),
 *   context: {},
 *   execute: async (params) => ({ llmResult: 'result' })
 * };
 * const langchainTool = tool(convertToLangchainTool(myTool));
 * 
 * // Use with LangChain
 * const result = await langchainTool.invoke({ input: 'test' });
 * ```
 */
export function convertToLangchainTool(
  tool: OpenAssistantTool<z.ZodTypeAny, unknown, unknown, unknown>
) {
  // Convert the OpenAssistant tool to LangChain tool configuration
  return {
    name: tool.name,
    description: tool.description,
    schema: tool.parameters,
    func: async (args: unknown) => {
      try {
        const result = await (tool.execute as (args: unknown, options?: unknown) => Promise<OpenAssistantExecuteFunctionResult>)(args, {
          toolCallId: 'langchain',
          context: tool.context && typeof tool.context === 'object' ? { ...tool.context } : {},
        });

        const { additionalData, llmResult } = result;

        if (additionalData && tool.onToolCompleted) {
          // LangChain may not surface a toolCallId, so we use a placeholder
          (tool.onToolCompleted as (toolCallId: string, additionalData?: unknown) => void)('langchain', additionalData);
        }

        // LangChain tools typically return a string or JSON-serializable object
        return llmResult as unknown;
      } catch (error) {
        // Propagate error as a thrown exception for LangChain to handle
        throw new Error(`Execute tool failed: ${error}`);
      }
    },
  };
}