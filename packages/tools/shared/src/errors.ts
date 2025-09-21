// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

/**
 * Standard error types for tools
 */
export class ToolError extends Error {
  public readonly code: string;
  public readonly context?: Record<string, unknown>;

  constructor(message: string, code: string, context?: Record<string, unknown>) {
    super(message);
    this.name = 'ToolError';
    this.code = code;
    this.context = context;
  }
}

/**
 * Error codes for different types of tool errors
 */
export const ToolErrorCodes = {
  // Context errors
  MISSING_CONTEXT: 'MISSING_CONTEXT',
  INVALID_CONTEXT: 'INVALID_CONTEXT',
  
  // Data errors
  MISSING_DATA: 'MISSING_DATA',
  INVALID_DATA: 'INVALID_DATA',
  DATA_NOT_FOUND: 'DATA_NOT_FOUND',
  
  // API errors
  API_ERROR: 'API_ERROR',
  API_TOKEN_MISSING: 'API_TOKEN_MISSING',
  API_RATE_LIMIT: 'API_RATE_LIMIT',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_PARAMETERS: 'INVALID_PARAMETERS',
  
  // Execution errors
  EXECUTION_ERROR: 'EXECUTION_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // Unknown errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ToolErrorCode = typeof ToolErrorCodes[keyof typeof ToolErrorCodes];

/**
 * Create a standardized error response for tools
 */
export function createErrorResponse(
  error: unknown,
  fallbackMessage: string = 'An unknown error occurred'
): {
  success: false;
  error: string;
  code?: string;
  context?: Record<string, unknown>;
} {
  if (error instanceof ToolError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      context: error.context,
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
      code: ToolErrorCodes.UNKNOWN_ERROR,
    };
  }

  return {
    success: false,
    error: fallbackMessage,
    code: ToolErrorCodes.UNKNOWN_ERROR,
  };
}

/**
 * Validate that a context has the required properties
 */
export function validateContext<T extends Record<string, unknown>>(
  context: unknown,
  requiredProperties: (keyof T)[],
  contextName: string = 'context'
): asserts context is T {
  if (!context || typeof context !== 'object') {
    throw new ToolError(
      `${contextName} is required and must be an object`,
      ToolErrorCodes.MISSING_CONTEXT,
      { contextName, requiredProperties }
    );
  }

  const missingProperties = requiredProperties.filter(
    prop => !(prop in context)
  );

  if (missingProperties.length > 0) {
    throw new ToolError(
      `${contextName} is missing required properties: ${missingProperties.join(', ')}`,
      ToolErrorCodes.INVALID_CONTEXT,
      { contextName, missingProperties, requiredProperties }
    );
  }
}

/**
 * Validate that data exists and is not empty
 */
export function validateData<T>(
  data: T | null | undefined,
  dataName: string = 'data'
): asserts data is T {
  if (data === null || data === undefined) {
    throw new ToolError(
      `${dataName} is required`,
      ToolErrorCodes.MISSING_DATA,
      { dataName }
    );
  }

  if (Array.isArray(data) && data.length === 0) {
    throw new ToolError(
      `${dataName} cannot be empty`,
      ToolErrorCodes.INVALID_DATA,
      { dataName }
    );
  }
}

/**
 * Validate API token
 */
export function validateApiToken(
  token: string | null | undefined,
  tokenName: string = 'API token'
): asserts token is string {
  if (!token || typeof token !== 'string' || token.trim().length === 0) {
    throw new ToolError(
      `${tokenName} is required and must be a non-empty string`,
      ToolErrorCodes.API_TOKEN_MISSING,
      { tokenName }
    );
  }
}