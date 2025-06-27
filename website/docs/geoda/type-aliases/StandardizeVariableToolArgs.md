# Type Alias: StandardizeVariableToolArgs

> **StandardizeVariableToolArgs**: `z.ZodObject`\<\{ `datasetName`: `z.ZodString`; `saveData`: `z.ZodOptional`\<`z.ZodBoolean`\>; `standardizationMethod`: `z.ZodEnum`\<\[`"deviationFromMean"`, `"standardizeMAD"`, `"rangeAdjust"`, `"rangeStandardize"`, `"standardize"`\]\>; `variableName`: `z.ZodString`; \}\>

Defined in: [packages/tools/geoda/src/variable/tool.ts:13](https://github.com/GeoDaCenter/openassistant/blob/0f7bf760e453a1735df9463dc799b04ee2f630fd/packages/tools/geoda/src/variable/tool.ts#L13)
