# Variable: ConversationSchema

> `const` **ConversationSchema**: `ZodObject`\<\{ `prompt`: `ZodString`; `response`: `ZodObject`\<\{ `parts`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{\}, `"strip"`, `ZodTypeAny`, \{\}, \{\}\>, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `parts`: `object`[]; \}, \{ `parts`: `object`[]; \}\>; \}, `"strip"`, `ZodTypeAny`, \{ `prompt`: `string`; `response`: \{ `parts`: `object`[]; \}; \}, \{ `prompt`: `string`; `response`: \{ `parts`: `object`[]; \}; \}\>

Defined in: [packages/core/src/utils/messages.ts:10](https://github.com/GeoDaCenter/openassistant/blob/dc72d81a35cf8e46295657303846fbb4ad891993/packages/core/src/utils/messages.ts#L10)
