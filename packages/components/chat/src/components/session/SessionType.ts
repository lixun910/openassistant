/**
 * Represents a session in the AI system.
 *
 * @example
 * ```typescript
 * const session: SessionType = {
 *   id: "session_123",
 *   name: "My Analysis Session",
 *   modelProvider: "openai",
 *   model: "gpt-4.1"
 * };
 * ```
 */
export type SessionType = {
  /** Unique identifier for the session */
  id: string;

  /** Display name of the session */
  name: string;

  /** Provider of the AI model (e.g., "openai") */
  modelProvider?: string;

  /** Name of the AI model being used (e.g., "gpt-4.1") */
  model?: string;
};
