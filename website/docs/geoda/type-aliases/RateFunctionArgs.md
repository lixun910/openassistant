# Type Alias: RateFunctionArgs

> **RateFunctionArgs**: `z.ZodObject`\<\{ `baseVariableName`: `z.ZodString`; `datasetName`: `z.ZodString`; `eventVariableName`: `z.ZodString`; `outputRateVariableName`: `z.ZodOptional`\<`z.ZodString`\>; `rateMethod`: `z.ZodEnum`\<\[`"Raw Rates"`, `"Excess Risk"`, `"Empirical Bayes"`, `"Spatial Rates"`, `"Spatial Empirical Bayes"`, `"EB Rate Standardization"`\]\>; `saveData`: `z.ZodOptional`\<`z.ZodBoolean`\>; `weightsID`: `z.ZodOptional`\<`z.ZodString`\>; \}\>

Defined in: [packages/tools/geoda/src/rate/tool.ts:154](https://github.com/GeoDaCenter/openassistant/blob/0f7bf760e453a1735df9463dc799b04ee2f630fd/packages/tools/geoda/src/rate/tool.ts#L154)
