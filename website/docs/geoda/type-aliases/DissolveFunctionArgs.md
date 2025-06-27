# Type Alias: DissolveFunctionArgs

> **DissolveFunctionArgs**: `z.ZodObject`\<\{ `aggregateVariables`: `z.ZodOptional`\<`z.ZodArray`\<`z.ZodObject`\<\{ `operator`: `z.ZodEnum`\<\[`"sum"`, `"mean"`, `"min"`, `"max"`, `"median"`, `"count"`, `"unique"`\]\>; `variableName`: `z.ZodString`; \}\>\>\>; `datasetName`: `z.ZodOptional`\<`z.ZodString`\>; `dissolveBy`: `z.ZodOptional`\<`z.ZodString`\>; `geojson`: `z.ZodOptional`\<`z.ZodString`\>; \}\>

Defined in: [packages/tools/geoda/src/spatial\_ops/dissolve.ts:10](https://github.com/GeoDaCenter/openassistant/blob/0f7bf760e453a1735df9463dc799b04ee2f630fd/packages/tools/geoda/src/spatial_ops/dissolve.ts#L10)
