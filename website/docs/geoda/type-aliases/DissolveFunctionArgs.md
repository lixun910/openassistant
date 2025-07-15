# Type Alias: DissolveFunctionArgs

> **DissolveFunctionArgs**: `z.ZodObject`\<\{ `aggregateVariables`: `z.ZodOptional`\<`z.ZodArray`\<`z.ZodObject`\<\{ `operator`: `z.ZodEnum`\<\[`"sum"`, `"mean"`, `"min"`, `"max"`, `"median"`, `"count"`, `"unique"`\]\>; `variableName`: `z.ZodString`; \}\>\>\>; `datasetName`: `z.ZodOptional`\<`z.ZodString`\>; `dissolveBy`: `z.ZodOptional`\<`z.ZodString`\>; `geojson`: `z.ZodOptional`\<`z.ZodString`\>; \}\>

Defined in: [packages/tools/geoda/src/spatial\_ops/dissolve.ts:10](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/geoda/src/spatial_ops/dissolve.ts#L10)
