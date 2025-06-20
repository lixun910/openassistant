# Variable: ConversationSchema

> `const` **ConversationSchema**: `ZodObject`\<\{ `prompt`: `ZodString`; `response`: `ZodObject`\<\{ `parts`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{\}, `"strip"`, `ZodTypeAny`, \{\}, \{\}\>, `"many"`\>\>; \}, `"strip"`, `ZodTypeAny`, \{ `parts`: `object`[]; \}, \{ `parts`: `object`[]; \}\>; \}, `"strip"`, `ZodTypeAny`, \{ `prompt`: `string`; `response`: \{ `parts`: `object`[]; \}; \}, \{ `prompt`: `string`; `response`: \{ `parts`: `object`[]; \}; \}\>

Defined in: [packages/core/src/utils/messages.ts:10](https://github.com/GeoDaCenter/openassistant/blob/37d127dc7a76d6b5cf9de906c055e4c904e3dfed/packages/core/src/utils/messages.ts#L10)
