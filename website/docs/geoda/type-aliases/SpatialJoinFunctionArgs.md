# Type Alias: SpatialJoinFunctionArgs

> **SpatialJoinFunctionArgs**: `z.ZodObject`\<\{ `joinVariables`: `z.ZodOptional`\<`z.ZodArray`\<`z.ZodObject`\<\{ `operator`: `z.ZodEnum`\<\[`"sum"`, `"mean"`, `"min"`, `"max"`, `"median"`, `"count"`, `"unique"`\]\>; `variableName`: `z.ZodString`; \}\>\>\>; `leftDatasetName`: `z.ZodString`; `rightDatasetName`: `z.ZodString`; \}\>

Defined in: [packages/tools/geoda/src/spatial\_join/tool.ts:14](https://github.com/GeoDaCenter/openassistant/blob/0f7bf760e453a1735df9463dc799b04ee2f630fd/packages/tools/geoda/src/spatial_join/tool.ts#L14)
