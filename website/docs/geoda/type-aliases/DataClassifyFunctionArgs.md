# Type Alias: DataClassifyFunctionArgs

> **DataClassifyFunctionArgs**: `z.ZodObject`\<\{ `datasetName`: `z.ZodString`; `hinge`: `z.ZodOptional`\<`z.ZodNumber`\>; `k`: `z.ZodOptional`\<`z.ZodNumber`\>; `method`: `z.ZodEnum`\<\[`"quantile"`, `"natural breaks"`, `"equal interval"`, `"percentile"`, `"box"`, `"standard deviation"`, `"unique values"`\]\>; `variableName`: `z.ZodString`; \}\>

Defined in: [packages/tools/geoda/src/data-classify/tool.ts:14](https://github.com/GeoDaCenter/openassistant/blob/0f7bf760e453a1735df9463dc799b04ee2f630fd/packages/tools/geoda/src/data-classify/tool.ts#L14)
