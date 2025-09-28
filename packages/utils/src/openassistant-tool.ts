/* eslint-disable @typescript-eslint/no-explicit-any */
// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { z, type ZodTypeAny } from 'zod';

export type OpenAssistantToolExecutionOptions = {
  toolCallId: string;
  abortSignal?: AbortSignal;
};

export type OpenAssistantOnToolCompleted = (
  toolCallId: string,
  additionalData?: unknown
) => void;

export type OpenAssistantExecuteFunctionResult<
  RETURN_TYPE = never,
  ADDITIONAL_DATA = never,
> = {
  llmResult: RETURN_TYPE extends never ? RETURN_TYPE : object;
  additionalData?: ADDITIONAL_DATA extends never ? ADDITIONAL_DATA : object;
};

export type OpenAssistantToolOptions<Params extends ZodTypeAny> = {
  description?: string;
  parameters?: Params;
  context?: Record<string, unknown>;
  component?: unknown; // React component - keep unknown to avoid React dependency
  onToolCompleted?: OpenAssistantOnToolCompleted;
};

export abstract class OpenAssistantTool<Params extends ZodTypeAny> {
  description: string;
  parameters: Params;
  context: Record<string, unknown>;
  component?: unknown; // React component - keep unknown to avoid React dependency
  onToolCompleted?: OpenAssistantOnToolCompleted;

  // Abstract methods that subclasses must implement
  protected abstract getDefaultDescription(): string;
  protected abstract getDefaultParameters(): Params;

  constructor(options: OpenAssistantToolOptions<Params> = {}) {
    this.description = options.description || this.getDefaultDescription();
    this.parameters = options.parameters || this.getDefaultParameters();
    this.context = options.context || {};
    this.component = options.component;
    this.onToolCompleted = options.onToolCompleted;
  }

  /**
   * Executes the tool's functionality.
   * @param params - Tool parameters.
   * @param options - Optional tool call options (Vercel or custom).
   */
  abstract execute(
    params: z.infer<Params>,
    options?: OpenAssistantToolExecutionOptions & {
      context?: Record<string, unknown>;
    }
  ): Promise<OpenAssistantExecuteFunctionResult>;

  /**
   * Convert this tool to a Vercel AI SDK v5 compatible tool.
   * This method requires the "ai" package to be available at runtime.
   * @param toolFactory - The Vercel AI SDK v5 tool factory (e.g., `tool` from 'ai')
   */
  public toVercelAiTool<F extends (config: any) => any>(
    toolFactory: F
  ): ReturnType<F> {
    if (!toolFactory) {
      throw new Error(
        'toVercelAiTool() requires a Vercel AI SDK v5 tool factory. Pass it as a parameter (e.g., `tool` from "ai").'
      );
    }

    // Convert the OpenAssistant tool to Vercel AI SDK v5 tool format via injected factory
    return toolFactory({
      description: this.description,
      inputSchema: this.parameters, // Vercel AI SDK v5 uses 'inputSchema'
      outputSchema: z.object({
        success: z.boolean(),
        result: z.string(),
        error: z.string().optional(),
      }),
      execute: async (
        args: unknown,
        options: OpenAssistantToolExecutionOptions & {
          context?: Record<string, unknown>;
        }
      ) => {
        const { toolCallId } = options;
        try {
          const result = await this.execute(args as z.infer<Params>, {
            ...options,
            context: { ...this.context, ...options.context },
          });

          const { additionalData, llmResult } = result;

          if (additionalData && toolCallId && this.onToolCompleted) {
            this.onToolCompleted(toolCallId, additionalData);
          }

          return {
            success: true,
            result: llmResult as unknown as string,
          } as unknown;
        } catch (error) {
          console.error(`Execute tool failed: ${error}`);
          return {
            success: false,
            error: `Execute tool failed: ${error}`,
          } as unknown;
        }
      },
    }) as ReturnType<F>;
  }

  /**
   * Convert this tool to a LangChain-compatible tool.
   * This method requires the "@langchain/core/tools" package to be available at runtime.
   * @param toolFactory - The LangChain tool factory (e.g., `tool` from '@langchain/core/tools')
   */
  public toLangchainTool(
    toolFactory: (config: {
      name?: string;
      description?: string;
      schema: ZodTypeAny;
      func: (input: unknown, config?: unknown) => Promise<unknown>;
    }) => unknown
  ) {
    if (!toolFactory) {
      throw new Error(
        'toLangchainTool() requires a LangChain 0.3.x tool factory. Pass it as a parameter (e.g., `tool` from "@langchain/core/tools").'
      );
    }

    // LangChain 0.3.x structured tool via injected factory
    return toolFactory({
      // Name is optional; downstream can assign one or use keys.
      description: this.description,
      schema: this.parameters,
      func: async (args: unknown) => {
        try {
          const result = await this.execute(
            args as z.infer<Params>,
            {
              toolCallId: 'langchain',
              context: { ...this.context },
            } as OpenAssistantToolExecutionOptions & {
              context?: Record<string, unknown>;
            }
          );

          const { additionalData, llmResult } = result;

          if (additionalData && this.onToolCompleted) {
            // LangChain may not surface a toolCallId, so we use a placeholder
            this.onToolCompleted('langchain', additionalData);
          }

          // LangChain tools typically return a string or JSON-serializable object
          return llmResult as unknown;
        } catch (error) {
          // Propagate error as a thrown exception for LangChain to handle
          throw new Error(`Execute tool failed: ${error}`);
        }
      },
    });
  }

  /**
   * Convert this tool to an Anthropic Claude-compatible tool.
   * This method requires the "@anthropic-ai/sdk" package to be available at runtime.
   * @param toolFactory - The Anthropic tool factory (e.g., `tool` from '@anthropic-ai/sdk')
   */
  public toAnthropicTool(
    toolFactory: (config: {
      name?: string;
      description?: string;
      inputSchema: ZodTypeAny;
    }) => unknown
  ) {
    if (!toolFactory) {
      throw new Error(
        'toAnthropicTool() requires an Anthropic tool factory. Pass it as a parameter (e.g., `tool` from "@anthropic-ai/sdk").'
      );
    }

    // Anthropic tool via injected factory
    return toolFactory({
      description: this.description,
      inputSchema: this.parameters,
    });
  }
}
