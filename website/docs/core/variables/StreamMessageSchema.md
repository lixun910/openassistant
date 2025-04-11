# Variable: StreamMessageSchema

> `const` **StreamMessageSchema**: `ZodObject`\<\{ `analysis`: `ZodOptional`\<`ZodString`\>; `parts`: `ZodOptional`\<`ZodArray`\<`ZodUnion`\<\[`ZodObject`\<\{ `text`: `ZodString`; `type`: `ZodLiteral`\<`"text"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `text`: `string`; `type`: `"text"`; \}, \{ `text`: `string`; `type`: `"text"`; \}\>, `ZodObject`\<\{ `toolCallMessages`: `ZodArray`\<`ZodObject`\<\{ `additionalData`: ...; `args`: ...; `isCompleted`: ...; `llmResult`: ...; `text`: ...; `toolCallId`: ...; `toolName`: ...; \}, `"strip"`, `ZodTypeAny`, \{ `additionalData`: ...; `args`: ...; `isCompleted`: ...; `llmResult`: ...; `text`: ...; `toolCallId`: ...; `toolName`: ...; \}, \{ `additionalData`: ...; `args`: ...; `isCompleted`: ...; `llmResult`: ...; `text`: ...; `toolCallId`: ...; `toolName`: ...; \}\>, `"many"`\>; `type`: `ZodLiteral`\<`"tool"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `toolCallMessages`: `object`[]; `type`: `"tool"`; \}, \{ `toolCallMessages`: `object`[]; `type`: `"tool"`; \}\>\]\>, `"many"`\>\>; `reasoning`: `ZodOptional`\<`ZodString`\>; `text`: `ZodOptional`\<`ZodString`\>; `toolCallMessages`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `additionalData`: `ZodOptional`\<`ZodUnknown`\>; `args`: `ZodRecord`\<`ZodString`, `ZodUnknown`\>; `isCompleted`: `ZodBoolean`; `llmResult`: `ZodOptional`\<`ZodUnknown`\>; `text`: `ZodOptional`\<`ZodString`\>; `toolCallId`: `ZodString`; `toolName`: `ZodString`; \}, `"strip"`, `ZodTypeAny`, \{ `additionalData`: `unknown`; `args`: `Record`\<`string`, `unknown`\>; `isCompleted`: `boolean`; `llmResult`: `unknown`; `text`: `string`; `toolCallId`: `string`; `toolName`: `string`; \}, \{ `additionalData`: `unknown`; `args`: `Record`\<`string`, `unknown`\>; `isCompleted`: `boolean`; `llmResult`: `unknown`; `text`: `string`; `toolCallId`: `string`; `toolName`: `string`; \}\>, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `analysis`: `string`; `parts`: (\{ `text`: `string`; `type`: `"text"`; \} \| \{ `toolCallMessages`: `object`[]; `type`: `"tool"`; \})[]; `reasoning`: `string`; `text`: `string`; `toolCallMessages`: `object`[]; \}, \{ `analysis`: `string`; `parts`: (\{ `text`: `string`; `type`: `"text"`; \} \| \{ `toolCallMessages`: `object`[]; `type`: `"tool"`; \})[]; `reasoning`: `string`; `text`: `string`; `toolCallMessages`: `object`[]; \}\>

Defined in: [packages/core/src/types.ts:370](https://github.com/GeoDaCenter/openassistant/blob/95db62ddd98ea06cccc7750f9f0e37556d8bf20e/packages/core/src/types.ts#L370)

Type of StreamMessageSchema

## Param

(deprecated. use parts instead) The reasoning of the assistant

## Param

(deprecated. use parts instead) The array of tool call messages. See [ToolCallMessage](../type-aliases/ToolCallMessage.md) for more details.

## Param

(deprecated. use parts instead) The analysis of the message. This is the text that happens before the tool calls.

## Param

(deprecated. use parts instead) The text of the message. This is the text that happens after the tool calls.

## Param

The parts of the message. This is the text that happens after the tool calls.
