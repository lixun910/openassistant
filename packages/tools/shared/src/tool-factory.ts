// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { getTool, OnToolCompleted } from '@openassistant/utils';
import { ToolError, ToolErrorCodes, createErrorResponse } from './errors';

/**
 * Standardized tool registration interface
 */
export interface ToolRegistry<T = Record<string, unknown>> {
  [key: string]: T;
}

/**
 * Options for creating a tool
 */
export interface CreateToolOptions<TContext = Record<string, unknown>> {
  toolContext?: TContext;
  onToolCompleted?: OnToolCompleted;
  isExecutable?: boolean;
}

/**
 * Create a single tool with standardized error handling
 */
export function createTool<TTool, TContext = Record<string, unknown>>(
  toolName: string,
  tools: ToolRegistry<TTool>,
  options: CreateToolOptions<TContext> = {}
) {
  const tool = tools[toolName];
  if (!tool) {
    throw new ToolError(
      `Tool "${toolName}" not found`,
      ToolErrorCodes.DATA_NOT_FOUND,
      { toolName, availableTools: Object.keys(tools) }
    );
  }

  return getTool({
    tool,
    options: {
      ...options,
      isExecutable: options.isExecutable ?? true,
    },
  });
}

/**
 * Create all tools from a registry with standardized error handling
 */
export function createAllTools<TTool, TContext = Record<string, unknown>>(
  tools: ToolRegistry<TTool>,
  toolContext: TContext,
  onToolCompleted: OnToolCompleted,
  isExecutable: boolean = true
) {
  const result: Record<string, unknown> = {};

  for (const [toolName, tool] of Object.entries(tools)) {
    try {
      result[toolName] = createTool(toolName, tools, {
        toolContext,
        onToolCompleted,
        isExecutable,
      });
    } catch (error) {
      console.error(`Failed to create tool "${toolName}":`, error);
      // Continue with other tools even if one fails
    }
  }

  return result;
}

/**
 * Standardized tool registration function
 */
export function createToolRegistry<TTool>(
  tools: Record<string, TTool>
): {
  tools: ToolRegistry<TTool>;
  registerTools: () => ToolRegistry<TTool>;
  createTool: (toolName: string, options?: CreateToolOptions) => unknown;
  createAllTools: (
    toolContext: unknown,
    onToolCompleted: OnToolCompleted,
    isExecutable?: boolean
  ) => Record<string, unknown>;
} {
  return {
    tools,
    registerTools: () => tools,
    createTool: (toolName: string, options: CreateToolOptions = {}) =>
      createTool(toolName, tools, options),
    createAllTools: (toolContext, onToolCompleted, isExecutable = true) =>
      createAllTools(tools, toolContext, onToolCompleted, isExecutable),
  };
}

/**
 * Execute a tool with standardized error handling
 */
export async function executeTool<TResult>(
  toolExecution: () => Promise<TResult>,
  fallbackMessage: string = 'Tool execution failed'
): Promise<TResult | { success: false; error: string; code?: string; context?: Record<string, unknown> }> {
  try {
    return await toolExecution();
  } catch (error) {
    console.error('Tool execution error:', error);
    return createErrorResponse(error, fallbackMessage);
  }
}