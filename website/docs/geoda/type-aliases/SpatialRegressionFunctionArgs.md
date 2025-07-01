# Type Alias: SpatialRegressionFunctionArgs

> **SpatialRegressionFunctionArgs**: `z.ZodObject`\<\{ `datasetName`: `z.ZodString`; `dependentVariable`: `z.ZodString`; `independentVariables`: `z.ZodArray`\<`z.ZodString`\>; `modelType`: `z.ZodEnum`\<\[`"classic"`, `"spatial-lag"`, `"spatial-error"`\]\>; `weightsId`: `z.ZodOptional`\<`z.ZodString`\>; \}\>

Defined in: [packages/tools/geoda/src/regression/tool.ts:13](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/geoda/src/regression/tool.ts#L13)
