# Type Alias: SpatialJoinFunctionArgs

> **SpatialJoinFunctionArgs**: `z.ZodObject`\<\{ `joinVariables`: `z.ZodOptional`\<`z.ZodArray`\<`z.ZodObject`\<\{ `operator`: `z.ZodEnum`\<\[`"sum"`, `"mean"`, `"min"`, `"max"`, `"median"`, `"count"`, `"unique"`\]\>; `variableName`: `z.ZodString`; \}\>\>\>; `leftDatasetName`: `z.ZodString`; `rightDatasetName`: `z.ZodString`; \}\>

Defined in: [packages/tools/geoda/src/spatial\_join/tool.ts:14](https://github.com/GeoDaCenter/openassistant/blob/dc72d81a35cf8e46295657303846fbb4ad891993/packages/tools/geoda/src/spatial_join/tool.ts#L14)
