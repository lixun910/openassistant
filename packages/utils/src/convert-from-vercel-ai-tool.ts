// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { ExtendedTool } from './tool';

/**
 * Convert a Vercel AI SDK tool to an ExtendedTool format.
 * This function requires the "ai" package to be available at runtime.
 * 
 * @param vercelAiTool - The Vercel AI SDK tool to convert
 * @returns An ExtendedTool compatible with OpenAssistant
 * 
 * @example
 * ```ts
 * import { convertFromVercelAiTool } from '@openassistant/utils';
 * 
 * const vercelTool = {
 *   description: 'Get weather information',
 *   parameters: z.object({ location: z.string() }),
 *   execute: async ({ location }) => {
 *     return `Weather in ${location}`;
 *   }
 * };
 * 
 * const extendedTool = convertFromVercelAiTool(vercelTool);
 * ```
 */
export function convertFromVercelAiTool(vercelAiTool: any): ExtendedTool {
  // Check if the 'ai' package is available
  try {
    eval('require')('ai');
    
    const { description, parameters, execute, ...rest } = vercelAiTool;
    
    const extendedTool: ExtendedTool = {
      description,
      parameters,
      execute: async (args: any, options: any) => {
        try {
          const result = await execute(args, options);
          
          // If the result is already in the expected format, return it
          if (typeof result === 'object' && result !== null && 'llmResult' in result) {
            return result;
          }
          
          // Otherwise, wrap it in the expected format
          return {
            llmResult: result,
          };
        } catch (error) {
          console.error(`Execute tool failed: ${error}`);
          return {
            llmResult: {
              success: false,
              error: `Execute tool failed: ${error}`,
            },
          };
        }
      },
      ...rest,
    };

    return extendedTool;
  } catch (error) {
    throw new Error('convertFromVercelAiTool() requires the "ai" package to be installed. Please install it with: npm install ai');
  }
}