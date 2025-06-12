# Variable: StreamMessageSchema

> `const` **StreamMessageSchema**: `ZodObject`\<\{ `parts`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{\}, `"strip"`, `ZodTypeAny`, \{\}, \{\}\>, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `parts`: `object`[]; \}, \{ `parts`: `object`[]; \}\>

Defined in: [packages/core/src/types.ts:138](https://github.com/GeoDaCenter/openassistant/blob/dc72d81a35cf8e46295657303846fbb4ad891993/packages/core/src/types.ts#L138)

Type of StreamMessageSchema

## Param

The parts of the message. This is the text that happens after the tool calls.
