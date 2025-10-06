import type { ZodType } from 'zod';

export type OpenAssistantToolParameters = ZodType<unknown>;

export type OpenAssistantOnToolCompleted = (
  toolCallId: string,
  additionalData?: unknown
) => void;

export type OpenAssistantExecuteFunctionResult<
  TLlmResult = unknown,
  TAdditionalData = unknown,
> = {
  llmResult: TLlmResult;
  additionalData?: TAdditionalData;
};

export type OpenAssistantToolExecutionOptions = {
  toolCallId: string;
  abortSignal?: AbortSignal;
};

export type OpenAssistantExecuteFunction<
  TArgs = unknown,
  TLlmResult = unknown,
  TAdditionalData = unknown,
  TContext = Record<string, unknown>,
> = (
  params: TArgs,
  options?: OpenAssistantToolExecutionOptions & {
    context?: TContext;
  }
) => Promise<OpenAssistantExecuteFunctionResult<TLlmResult, TAdditionalData>>;

export type OpenAssistantTool<
  TArgs = unknown,
  TLlmResult = unknown,
  TAdditionalData = unknown,
  TContext = Record<string, unknown>,
> = {
  name: string;
  description: string;
  parameters: OpenAssistantToolParameters;
  context: TContext;
  component?: unknown;
  onToolCompleted?: OpenAssistantOnToolCompleted;
  execute: OpenAssistantExecuteFunction<TArgs, TLlmResult, TAdditionalData, TContext>;
};

export type OpenAssistantToolSet = Record<string, OpenAssistantTool>;

// Legacy exports for backward compatibility
export type OnToolCompleted = OpenAssistantOnToolCompleted;
