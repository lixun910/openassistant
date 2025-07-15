# Type Alias: SpatialJoinFunctionArgs

> **SpatialJoinFunctionArgs**: `z.ZodObject`\<\{ `joinVariables`: `z.ZodOptional`\<`z.ZodArray`\<`z.ZodObject`\<\{ `operator`: `z.ZodEnum`\<\[`"sum"`, `"mean"`, `"min"`, `"max"`, `"median"`, `"count"`, `"unique"`\]\>; `variableName`: `z.ZodString`; \}\>\>\>; `leftDatasetName`: `z.ZodString`; `rightDatasetName`: `z.ZodString`; \}\>

Defined in: [packages/tools/geoda/src/spatial\_join/tool.ts:14](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/geoda/src/spatial_join/tool.ts#L14)
