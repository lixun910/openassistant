# Type Alias: StandardizeVariableToolArgs

> **StandardizeVariableToolArgs**: `z.ZodObject`\<\{ `datasetName`: `z.ZodString`; `saveData`: `z.ZodOptional`\<`z.ZodBoolean`\>; `standardizationMethod`: `z.ZodEnum`\<\[`"deviationFromMean"`, `"standardizeMAD"`, `"rangeAdjust"`, `"rangeStandardize"`, `"standardize"`\]\>; `variableName`: `z.ZodString`; \}\>

Defined in: [packages/tools/geoda/src/variable/tool.ts:13](https://github.com/GeoDaCenter/openassistant/blob/dc72d81a35cf8e46295657303846fbb4ad891993/packages/tools/geoda/src/variable/tool.ts#L13)
