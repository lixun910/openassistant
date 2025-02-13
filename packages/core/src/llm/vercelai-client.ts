import { AudioToTextProps, StreamMessageCallback } from '../types';
import { ReactNode } from 'react';
import {
  generateText,
  LanguageModel,
  LanguageModelUsage,
  streamText,
  Tool,
} from 'ai';
import { Message, extractMaxToolInvocationStep } from '@ai-sdk/ui-utils';
import { shouldTriggerNextRequest, VercelAi } from './vercelai';
import { convertOpenAIToolsToVercelTools } from '../lib/tool-utils';
import { tiktokenCounter } from '../utils/token-counter';
import { proceedToolCall } from '../utils/toolcall';

export type VercelAiClientConfigureProps = {
  apiKey?: string;
  model?: string;
  instructions?: string;
  temperature?: number;
  topP?: number;
  description?: string;
  version?: string;
  maxTokens?: number;
  baseURL?: string;
};

/**
 * Abstract Vercel AI Client for Client only. This class is extended from VercelAi class.
 * However, it overrides the triggerRequest method to call LLM using Vercel AI SDK
 * directly from local e.g. browser instead of POST request to API endpoint.
 *
 * It has a protected property llm: LanguageModel | null = null, which is initialized in the constructor.
 * It also has a protected static properties which are for client-side support:
 * - apiKey: string = '';
 * - model: string = '';
 * - baseURL: string = '';
 *
 * These properties are initialized in the configure method.
 *
 * The constructor is protected, so it cannot be instantiated directly.
 *
 */
export abstract class VercelAiClient extends VercelAi {
  protected static apiKey = '';
  protected static model = '';
  protected static baseURL = '';

  public llm: LanguageModel | null = null;

  protected static instance: VercelAiClient | null = null;

  public static getBaseURL() {
    throw new Error('No base URL for VercelAiClient. It is an abstract class.');
  }

  protected static checkModel() {
    if (!VercelAiClient.model || VercelAiClient.model.trim() === '') {
      throw new Error('LLM is not configured. Please call configure() first.');
    }
  }

  protected static checkApiKey() {
    if (!VercelAiClient.apiKey || VercelAiClient.apiKey.trim() === '') {
      throw new Error('LLM is not configured. Please call configure() first.');
    }
  }

  protected constructor() {
    super();
  }

  public static override configure(config: VercelAiClientConfigureProps) {
    if (config.apiKey) VercelAiClient.apiKey = config.apiKey;
    if (config.model) VercelAiClient.model = config.model;
    if (config.instructions) VercelAiClient.instructions = config.instructions;
    if (config.temperature) VercelAiClient.temperature = config.temperature;
    if (config.topP) VercelAiClient.topP = config.topP;
    if (config.description) VercelAiClient.description = config.description;
    if (config.baseURL) VercelAiClient.baseURL = config.baseURL;
  }

  public override restart() {
    this.stop();
    this.messages = [];
    // need to reset the llm so getInstance doesn't return the same instance
    this.llm = null;
  }

  protected async trimMessages() {
    let totalTokens = await tiktokenCounter(this.messages);

    // add token for the system message
    totalTokens += await tiktokenCounter([
      { role: 'system', content: VercelAi.instructions, id: 'system' },
    ]);

    // add token for the tools
    if (VercelAi.tools) {
      totalTokens += await tiktokenCounter(
        Object.values(VercelAi.tools).map((tool: Tool) => ({
          role: 'assistant',
          content: JSON.stringify(tool.parameters),
          id: 'tool',
        }))
      );
    }

    if (totalTokens <= VercelAi.maxTokens) {
      return this.messages;
    }
    // make a copy of the messages array
    const updatedMessages = this.messages.slice(0);

    if (totalTokens > VercelAi.maxTokens) {
      // remove one message at a time
      while (updatedMessages.length > 0) {
        const removedMessage = updatedMessages.shift();
        const remainingTokens = await tiktokenCounter([removedMessage!]);
        totalTokens -= remainingTokens;

        if (totalTokens <= VercelAi.maxTokens) {
          break;
        }
      }
    }

    return updatedMessages;
  }

  /**
   * Trigger the request to the Vercel AI API
   * Override the triggerRequest method to call LLM with Vercel AI SDK from local e.g. browser
   * @param streamMessageCallback - The callback function to stream the message
   * @returns The custom message and the tokens used
   */
  protected async triggerRequest({
    streamMessageCallback,
  }: {
    streamMessageCallback: StreamMessageCallback;
  }) {
    if (!this.llm) {
      throw new Error(
        'LLM instance is not initialized. Please call configure() first if you want to create a client LLM instance.'
      );
    }

    let messageContent: string = '';
    let customMessage: ReactNode | null = null;
    const tokensUsed: LanguageModelUsage = {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    };

    const maxSteps = 4;
    const messageCount = this.messages.length;
    const maxStep = extractMaxToolInvocationStep(
      this.messages[this.messages.length - 1]?.toolInvocations
    );

    const tools = VercelAiClient.tools
      ? convertOpenAIToolsToVercelTools(VercelAiClient.tools)
      : VercelAiClient.tools;

    const { fullStream } = streamText({
      model: this.llm,
      messages: this.messages,
      tools,
      system: VercelAiClient.instructions,
      temperature: VercelAiClient.temperature,
      topP: VercelAiClient.topP,
      maxSteps,
      abortSignal: this.abortController?.signal,
      onFinish: async ({ toolCalls, response, usage }) => {
        // response messages could be CoreAssistantMessage | CoreToolMessage
        const responseMsg = response.messages[response.messages.length - 1];

        // add final message to the messages array
        const message: Message = {
          id: responseMsg.id,
          role: responseMsg.role as 'assistant',
          content: messageContent,
          toolInvocations: [],
        };

        // handle tool calls
        for (const toolCall of toolCalls) {
          const result = await proceedToolCall({
            toolCall,
            customFunctions: VercelAi.customFunctions,
          });
          customMessage = result.customMessage;
          message.toolInvocations = [
            {
              toolCallId: toolCall.toolCallId,
              result: result.toolResult,
              state: 'result',
              toolName: toolCall.toolName,
              args: toolCall.args,
            },
          ];
        }

        // add the response message to the messages array
        this.messages?.push(message);

        // NOTE: some providers will not return usage values, we still need to count the token usage
        // safely handle potentially undefined usage values
        tokensUsed.promptTokens = usage?.promptTokens || 0;
        tokensUsed.completionTokens = usage?.completionTokens || 0;
        tokensUsed.totalTokens = usage?.totalTokens || 0;
      },
    });

    for await (const chunk of fullStream) {
      if (chunk.type === 'text-delta') {
        messageContent += chunk.textDelta;
        streamMessageCallback({
          deltaMessage: messageContent,
          customMessage,
        });
      } else if (chunk.type === 'reasoning') {
        messageContent += chunk.textDelta;
        streamMessageCallback({
          deltaMessage: messageContent,
          customMessage,
        });
      } else if (chunk.type === 'error') {
        throw new Error(`Error from Vercel AI API: ${chunk.error}`);
      }
    }

    // check after LLM response is finished
    // auto-submit when all tool calls in the last assistant message have results:
    if (
      shouldTriggerNextRequest(this.messages, messageCount, maxSteps, maxStep)
    ) {
      await this.triggerRequest({ streamMessageCallback });
    }

    return { customMessage, tokensUsed };
  }

  public override async audioToText({
    audioBlob,
  }: AudioToTextProps): Promise<string> {
    if (!this.llm) {
      throw new Error('LLM is not configured. Please call configure() first.');
    }
    if (!audioBlob) {
      throw new Error('audioBlob is null');
    }
    if (!this.abortController) {
      this.abortController = new AbortController();
    }

    const file = new File([audioBlob], 'audio.webm');

    const response = await generateText({
      model: this.llm,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Translating audio to text, and return plain text based on the following schema: {text: content}',
            },
            {
              type: 'file',
              data: file,
              mimeType: 'audio/webm',
            },
          ],
        },
      ],
    });

    return response.text;
  }
}
