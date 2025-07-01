# Type Alias: StandardizeVariableToolArgs

> **StandardizeVariableToolArgs**: `z.ZodObject`\<\{ `datasetName`: `z.ZodString`; `saveData`: `z.ZodOptional`\<`z.ZodBoolean`\>; `standardizationMethod`: `z.ZodEnum`\<\[`"deviationFromMean"`, `"standardizeMAD"`, `"rangeAdjust"`, `"rangeStandardize"`, `"standardize"`\]\>; `variableName`: `z.ZodString`; \}\>

Defined in: [packages/tools/geoda/src/variable/tool.ts:13](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/geoda/src/variable/tool.ts#L13)
