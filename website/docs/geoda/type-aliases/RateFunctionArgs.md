# Type Alias: RateFunctionArgs

> **RateFunctionArgs**: `z.ZodObject`\<\{ `baseVariableName`: `z.ZodString`; `datasetName`: `z.ZodString`; `eventVariableName`: `z.ZodString`; `outputRateVariableName`: `z.ZodOptional`\<`z.ZodString`\>; `rateMethod`: `z.ZodEnum`\<\[`"Raw Rates"`, `"Excess Risk"`, `"Empirical Bayes"`, `"Spatial Rates"`, `"Spatial Empirical Bayes"`, `"EB Rate Standardization"`\]\>; `saveData`: `z.ZodOptional`\<`z.ZodBoolean`\>; `weightsID`: `z.ZodOptional`\<`z.ZodString`\>; \}\>

Defined in: packages/tools/geoda/src/rate/tool.ts:149
