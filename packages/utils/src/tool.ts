import type { ZodType } from 'zod';
import { z } from 'zod';

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
  TContext = unknown,
> = (
  params: TArgs,
  options?: OpenAssistantToolExecutionOptions & {
    context?: TContext;
  }
) => Promise<OpenAssistantExecuteFunctionResult<TLlmResult, TAdditionalData>>;

export type OpenAssistantTool<
  TArgs extends ZodType = ZodType<unknown>,
  TLlmResult = unknown,
  TAdditionalData = unknown,
  TContext = unknown,
> = {
  name: string;
  description: string;
  parameters: TArgs;
  context?: TContext;
  component?: unknown;
  onToolCompleted?: OpenAssistantOnToolCompleted;
  execute: OpenAssistantExecuteFunction<
    z.infer<TArgs>,
    TLlmResult,
    TAdditionalData,
    TContext
  >;
};

export type OpenAssistantToolSet = Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  OpenAssistantTool<any, any, any, any>
>;

// Legacy exports for backward compatibility
export type OnToolCompleted = OpenAssistantOnToolCompleted;
