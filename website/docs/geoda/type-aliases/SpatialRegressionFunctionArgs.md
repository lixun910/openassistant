# Type Alias: SpatialRegressionFunctionArgs

> **SpatialRegressionFunctionArgs**: `z.ZodObject`\<\{ `datasetName`: `z.ZodString`; `dependentVariable`: `z.ZodString`; `independentVariables`: `z.ZodArray`\<`z.ZodString`\>; `modelType`: `z.ZodEnum`\<\[`"classic"`, `"spatial-lag"`, `"spatial-error"`\]\>; `weightsId`: `z.ZodOptional`\<`z.ZodString`\>; \}\>

Defined in: [packages/tools/geoda/src/regression/tool.ts:13](https://github.com/GeoDaCenter/openassistant/blob/0f7bf760e453a1735df9463dc799b04ee2f630fd/packages/tools/geoda/src/regression/tool.ts#L13)
