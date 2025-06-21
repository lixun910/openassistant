# Type Alias: MergeTablesArgs

> **MergeTablesArgs**: `z.ZodObject`\<\{ `columnNamesA`: `z.ZodArray`\<`z.ZodString`\>; `columnNamesB`: `z.ZodArray`\<`z.ZodString`\>; `datasetNameA`: `z.ZodString`; `datasetNameB`: `z.ZodString`; `dbTableNameA`: `z.ZodString`; `dbTableNameB`: `z.ZodString`; `keyColumn`: `z.ZodOptional`\<`z.ZodString`\>; `mergeType`: `z.ZodEnum`\<\[`"horizontal"`, `"vertical"`\]\>; `sql`: `z.ZodString`; \}\>

Defined in: [packages/tools/duckdb/src/merge.ts:193](https://github.com/GeoDaCenter/openassistant/blob/bc4037be52d89829440fcc4aaa1010be73719d16/packages/tools/duckdb/src/merge.ts#L193)
