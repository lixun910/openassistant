# Type Alias: DataClassifyFunctionArgs

> **DataClassifyFunctionArgs**: `z.ZodObject`\<\{ `datasetName`: `z.ZodString`; `hinge`: `z.ZodOptional`\<`z.ZodNumber`\>; `k`: `z.ZodOptional`\<`z.ZodNumber`\>; `method`: `z.ZodEnum`\<\[`"quantile"`, `"natural breaks"`, `"equal interval"`, `"percentile"`, `"box"`, `"standard deviation"`, `"unique values"`\]\>; `variableName`: `z.ZodString`; \}\>

Defined in: [packages/tools/geoda/src/data-classify/tool.ts:14](https://github.com/GeoDaCenter/openassistant/blob/bc4037be52d89829440fcc4aaa1010be73719d16/packages/tools/geoda/src/data-classify/tool.ts#L14)
