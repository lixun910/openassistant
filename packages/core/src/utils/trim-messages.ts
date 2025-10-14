// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { tiktokenCounter } from './token-counter';
import { Tool, ToolSet, CoreMessage } from 'ai';
import { Message } from '@ai-sdk/ui-utils';

export async function trimMessages({
  messages,
  instructions,
  tools,
  maxTokens,
}: {
  messages: Array<Message | CoreMessage>;
  instructions: string;
  tools: ToolSet;
  maxTokens: number;
}) {
  // Early return if no messages
  if (messages.length === 0) {
    return messages;
  }

  // Count tokens once for all components
  let totalTokens = await tiktokenCounter(messages);

  // Add tokens for the system message
  totalTokens += await tiktokenCounter([
    { role: 'system', content: instructions, id: 'system' },
  ]);

  // Add tokens for the tools
  if (tools) {
    totalTokens += await tiktokenCounter(
      Object.values(tools).map((tool: Tool) => ({
        role: 'assistant',
        content: JSON.stringify(tool.parameters),
        id: 'tool',
      }))
    );
  }

  // If under limit, return original messages
  if (totalTokens <= maxTokens) {
    return messages;
  }

  // Find the position where removing messages from the start brings us under the limit
  let messagesToRemove = 0;

  for (let i = 0; i < messages.length; i++) {
    const messageTokens = await tiktokenCounter([messages[i]]);
    
    if (totalTokens - messageTokens < maxTokens) {
      // Found the position - removing this message brings us under the limit
      messagesToRemove = i + 1;
      break;
    }
    
    totalTokens -= messageTokens;
  }

  // If we need to remove all messages or more, keep at least the last message
  if (messagesToRemove >= messages.length) {
    messagesToRemove = messages.length - 1;
  }

  // Remove messages from the beginning in one operation
  return messages.slice(messagesToRemove);
}
