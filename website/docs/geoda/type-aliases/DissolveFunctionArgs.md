# Type Alias: DissolveFunctionArgs

> **DissolveFunctionArgs**: `z.ZodObject`\<\{ `aggregateVariables`: `z.ZodOptional`\<`z.ZodArray`\<`z.ZodObject`\<\{ `operator`: `z.ZodEnum`\<\[`"sum"`, `"mean"`, `"min"`, `"max"`, `"median"`, `"count"`, `"unique"`\]\>; `variableName`: `z.ZodString`; \}\>\>\>; `datasetName`: `z.ZodOptional`\<`z.ZodString`\>; `dissolveBy`: `z.ZodOptional`\<`z.ZodString`\>; `geojson`: `z.ZodOptional`\<`z.ZodString`\>; \}\>

Defined in: [packages/tools/geoda/src/spatial\_ops/dissolve.ts:10](https://github.com/GeoDaCenter/openassistant/blob/bc4037be52d89829440fcc4aaa1010be73719d16/packages/tools/geoda/src/spatial_ops/dissolve.ts#L10)
