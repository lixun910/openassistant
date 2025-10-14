// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

/**
 * Model context window sizes (in tokens) for various LLM providers.
 * These values represent the maximum context length each model can handle.
 */
export const MODEL_CONTEXT_WINDOWS: Record<string, number> = {
  // OpenAI models
  'gpt-4o': 128_000,
  'gpt-4o-mini': 128_000,
  'gpt-4-turbo': 128_000,
  'gpt-4-1106-preview': 128_000, // Specific version, different from base gpt-4
  'gpt-4': 8_192,
  'gpt-4-32k': 32_768,
  'gpt-3.5-turbo': 16_385,
  'gpt-4.1': 128_000,
  'gpt-4.1-mini': 128_000,
  'gpt-4.1-nano': 128_000,
  'gpt-5': 1_000_000,
  'o1': 200_000,
  'o1-preview': 128_000,
  'o1-mini': 128_000,

  // Anthropic models
  'claude-3-5-sonnet': 200_000,
  'claude-3-5-haiku': 200_000,
  'claude-3-opus': 200_000,
  'claude-3-sonnet': 200_000,
  'claude-3-haiku': 200_000,
  'claude-4-opus': 200_000,
  'claude-4-sonnet': 1_000_000,
  'claude-4.5-sonnet': 1_000_000,
  'claude-4-haiku': 200_000,

  // Google models
  'gemini-2.0-flash': 1_000_000,
  'gemini-2.0-flash-lite': 1_000_000,
  'gemini-2.0-pro-exp-02-05': 1_000_000,
  'gemini-2.5-flash-preview-04-17': 1_000_000,
  'gemini-2.5-pro-preview-05-06': 2_000_000,
  'gemini-1.5-pro': 2_000_000,
  'gemini-1.5-flash': 1_000_000,
  'gemini-pro': 32_768,

  // DeepSeek models
  'deepseek-chat': 64_000,
  'deepseek-coder': 16_000,

  // xAI models
  'grok-beta': 128_000,
  'grok-2': 128_000,

  // Ollama models (these vary, using conservative defaults)
  'llama3': 8_192,
  'llama3.1': 128_000,
  'llama3.2': 128_000,
  'llama3.3': 128_000,
  'llama4': 128_000,
  'mistral': 8_192,
  'mixtral': 32_768,
  'phi3': 128_000,
  'phi4': 16_384,
  'qwen2.5': 32_768,
  'qwen3': 32_768,
  'qwen3:32b': 32_768,
  'gemma2': 8_192,
  'gemma3': 8_192,
  'deepseek-r1': 64_000,
  'gpt-oss': 128_000,
};

/**
 * Default context window size when model is not found in the mapping
 */
export const DEFAULT_CONTEXT_WINDOW = 128_000;

/**
 * Custom model context windows provided by users
 */
let customModelContextWindows: Record<string, number> = {};

/**
 * Set custom model context windows to extend or override the default mapping
 * @param customWindows - Custom model to context window mapping
 */
export function setCustomModelContextWindows(
  customWindows: Record<string, number>
): void {
  customModelContextWindows = { ...customWindows };
}

/**
 * Get the context window size for a given model
 * @param modelId - The model identifier (e.g., 'gpt-4o', 'claude-3-5-sonnet')
 * @param userMaxTokens - Optional user-specified max tokens to override the default
 * @returns The context window size in tokens
 *
 * @example
 * ```typescript
 * const contextWindow = getModelContextWindow('gpt-4o');
 * // Returns: 128000
 *
 * const customWindow = getModelContextWindow('gpt-4o', 50000);
 * // Returns: 50000 (user override)
 * ```
 */
export function getModelContextWindow(
  modelId: string,
  userMaxTokens?: number
): number {
  // User-specified maxTokens takes highest priority
  if (userMaxTokens !== undefined && userMaxTokens > 0) {
    return userMaxTokens;
  }

  // Check custom model context windows
  if (customModelContextWindows[modelId]) {
    return customModelContextWindows[modelId];
  }

  // Check built-in mapping for exact match
  if (MODEL_CONTEXT_WINDOWS[modelId]) {
    return MODEL_CONTEXT_WINDOWS[modelId];
  }

  // Try prefix matching for versioned models
  // Examples:
  // - 'claude-3-5-haiku-20241022' matches 'claude-3-5-haiku'
  // - 'gpt-4o-2024-05-13' matches 'gpt-4o'
  for (const key of Object.keys(MODEL_CONTEXT_WINDOWS)) {
    if (modelId.startsWith(key + '-')) {
      return MODEL_CONTEXT_WINDOWS[key];
    }
  }

  // Return default
  return DEFAULT_CONTEXT_WINDOW;
}

