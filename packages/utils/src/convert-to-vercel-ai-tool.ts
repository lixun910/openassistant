// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OpenAssistantTool } from './openassistant-tool';
import { ExtendedTool } from './tool';

export type ConvertToVercelAiToolOptions = {
  isExecutable?: boolean;
};

/**
 * Convert an OpenAssistant tool to a Vercel AI SDK v5 compatible tool.
 * This function requires the "ai" package to be available at runtime.
 * 
 * @param tool - The OpenAssistant tool to convert
 * @param options - Optional configuration options
 * @returns A Vercel AI SDK compatible tool
 * 
 * @example
 * ```ts
 * import { convertToVercelAiTool } from '@openassistant/utils';
 * 
 * const myTool = new MyTool({
 *   description: 'Get weather information',
 *   parameters: z.object({ location: z.string() }),
 *   execute: async ({ location }) => {
 *     return { llmResult: `Weather in ${location}` };
 *   }
 * });
 * 
 * const vercelTool = convertToVercelAiTool(myTool);
 * 
 * // Use with Vercel AI SDK
 * const result = await generateText({
 *   model: openai('gpt-4'),
 *   tools: { weather: vercelTool },
 *   prompt: 'What is the weather in New York?'
 * });
 * ```
 */
export function convertToVercelAiTool<PARAMETERS, RETURN_TYPE, ADDITIONAL_DATA, CONTEXT>(
  tool: OpenAssistantTool<PARAMETERS> | ExtendedTool<PARAMETERS, RETURN_TYPE, ADDITIONAL_DATA, CONTEXT>,
  options: ConvertToVercelAiToolOptions = {}
): any {
  // Check if the 'ai' package is available
  try {
    const ai = eval('require')('ai');
    const Tool = ai.Tool;
    
    // Handle OpenAssistantTool instances
    if (tool instanceof OpenAssistantTool) {
      return tool.toVercelAiTool();
    }
    
    // Handle ExtendedTool objects
    const { execute, context, component, onToolCompleted, ...rest } = tool;
    
    const vercelTool: any = {
      ...rest,
      execute: async (args: any, options: any) => {
        const { toolCallId } = options;
        try {
          const result = await execute(args as never, { 
            ...options, 
            context: { ...context, ...options.context } 
          });

          const { additionalData, llmResult } = result;

          if (additionalData && toolCallId && onToolCompleted) {
            onToolCompleted(toolCallId, additionalData);
          }

          return llmResult;
        } catch (error) {
          console.error(`Execute tool failed: ${error}`);
          return {
            success: false,
            error: `Execute tool failed: ${error}`,
          };
        }
      },
    };

    return vercelTool;
  } catch (error) {
    throw new Error('convertToVercelAiTool() requires the "ai" package to be installed. Please install it with: npm install ai');
  }
}