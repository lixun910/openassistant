# Type Alias: DissolveFunctionArgs

> **DissolveFunctionArgs**: `z.ZodObject`\<\{ `aggregateVariables`: `z.ZodOptional`\<`z.ZodArray`\<`z.ZodObject`\<\{ `operator`: `z.ZodEnum`\<\[`"sum"`, `"mean"`, `"min"`, `"max"`, `"median"`, `"count"`, `"unique"`\]\>; `variableName`: `z.ZodString`; \}\>\>\>; `datasetName`: `z.ZodOptional`\<`z.ZodString`\>; `dissolveBy`: `z.ZodOptional`\<`z.ZodString`\>; `geojson`: `z.ZodOptional`\<`z.ZodString`\>; \}\>

Defined in: [packages/tools/geoda/src/spatial\_ops/dissolve.ts:10](https://github.com/GeoDaCenter/openassistant/blob/dc72d81a35cf8e46295657303846fbb4ad891993/packages/tools/geoda/src/spatial_ops/dissolve.ts#L10)
