# Type Alias: MergeTablesArgs

> **MergeTablesArgs**: `z.ZodObject`\<\{ `columnNamesA`: `z.ZodArray`\<`z.ZodString`\>; `columnNamesB`: `z.ZodArray`\<`z.ZodString`\>; `datasetNameA`: `z.ZodString`; `datasetNameB`: `z.ZodString`; `dbTableNameA`: `z.ZodString`; `dbTableNameB`: `z.ZodString`; `keyColumn`: `z.ZodOptional`\<`z.ZodString`\>; `mergeType`: `z.ZodEnum`\<\[`"horizontal"`, `"vertical"`\]\>; `sql`: `z.ZodString`; \}\>

Defined in: [packages/tools/duckdb/src/merge.ts:193](https://github.com/GeoDaCenter/openassistant/blob/37d127dc7a76d6b5cf9de906c055e4c904e3dfed/packages/tools/duckdb/src/merge.ts#L193)
