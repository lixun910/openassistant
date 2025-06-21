# Type Alias: StandardizeVariableToolArgs

> **StandardizeVariableToolArgs**: `z.ZodObject`\<\{ `datasetName`: `z.ZodString`; `saveData`: `z.ZodOptional`\<`z.ZodBoolean`\>; `standardizationMethod`: `z.ZodEnum`\<\[`"deviationFromMean"`, `"standardizeMAD"`, `"rangeAdjust"`, `"rangeStandardize"`, `"standardize"`\]\>; `variableName`: `z.ZodString`; \}\>

Defined in: [packages/tools/geoda/src/variable/tool.ts:13](https://github.com/GeoDaCenter/openassistant/blob/bc4037be52d89829440fcc4aaa1010be73719d16/packages/tools/geoda/src/variable/tool.ts#L13)
