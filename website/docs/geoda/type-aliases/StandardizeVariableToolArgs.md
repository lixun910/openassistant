# Type Alias: StandardizeVariableToolArgs

> **StandardizeVariableToolArgs**: `z.ZodObject`\<\{ `datasetName`: `z.ZodString`; `saveData`: `z.ZodOptional`\<`z.ZodBoolean`\>; `standardizationMethod`: `z.ZodEnum`\<\[`"deviationFromMean"`, `"standardizeMAD"`, `"rangeAdjust"`, `"rangeStandardize"`, `"standardize"`\]\>; `variableName`: `z.ZodString`; \}\>

Defined in: [packages/tools/geoda/src/variable/tool.ts:13](https://github.com/GeoDaCenter/openassistant/blob/37d127dc7a76d6b5cf9de906c055e4c904e3dfed/packages/tools/geoda/src/variable/tool.ts#L13)
