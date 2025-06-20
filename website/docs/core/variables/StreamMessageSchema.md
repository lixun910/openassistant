# Variable: StreamMessageSchema

> `const` **StreamMessageSchema**: `ZodObject`\<\{ `parts`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{\}, `"strip"`, `ZodTypeAny`, \{\}, \{\}\>, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `parts`: `object`[]; \}, \{ `parts`: `object`[]; \}\>

Defined in: [packages/core/src/types.ts:138](https://github.com/GeoDaCenter/openassistant/blob/37d127dc7a76d6b5cf9de906c055e4c904e3dfed/packages/core/src/types.ts#L138)

Type of StreamMessageSchema

## Param

The parts of the message. This is the text that happens after the tool calls.
