# Type Alias: DissolveFunctionArgs

> **DissolveFunctionArgs**: `z.ZodObject`\<\{ `aggregateVariables`: `z.ZodOptional`\<`z.ZodArray`\<`z.ZodObject`\<\{ `operator`: `z.ZodEnum`\<\[`"sum"`, `"mean"`, `"min"`, `"max"`, `"median"`, `"count"`, `"unique"`\]\>; `variableName`: `z.ZodString`; \}\>\>\>; `datasetName`: `z.ZodOptional`\<`z.ZodString`\>; `dissolveBy`: `z.ZodOptional`\<`z.ZodString`\>; `geojson`: `z.ZodOptional`\<`z.ZodString`\>; \}\>

Defined in: [packages/tools/geoda/src/spatial\_ops/dissolve.ts:10](https://github.com/GeoDaCenter/openassistant/blob/37d127dc7a76d6b5cf9de906c055e4c904e3dfed/packages/tools/geoda/src/spatial_ops/dissolve.ts#L10)
