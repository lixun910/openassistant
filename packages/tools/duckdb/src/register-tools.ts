// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { localQuery } from './tool';
import { OnToolCompleted } from '@openassistant/utils';
import { LocalQueryContext } from './types';
import { createToolRegistry, ToolError, ToolErrorCodes } from '@openassistant/tools-shared';

// export the enum of tool names, so users can use it to check if a tool is available
export enum DuckDBToolNames {
  localQuery = 'localQuery',
}

const toolRegistry = createToolRegistry({
  localQuery,
});

export const tools = toolRegistry.tools;
export const registerTools = toolRegistry.registerTools;

export function getDuckDBTool(
  toolName: string,
  options: {
    toolContext?: LocalQueryContext;
    onToolCompleted?: OnToolCompleted;
    isExecutable?: boolean;
  }
) {
  return toolRegistry.createTool(toolName, options);
}

export function getDuckDBTools(
  toolContext: LocalQueryContext,
  onToolCompleted: OnToolCompleted,
  isExecutable: boolean = true
) {
  return toolRegistry.createAllTools(toolContext, onToolCompleted, isExecutable);
}
