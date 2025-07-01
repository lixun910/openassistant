# Type Alias: MergeTablesArgs

> **MergeTablesArgs**: `z.ZodObject`\<\{ `columnNamesA`: `z.ZodArray`\<`z.ZodString`\>; `columnNamesB`: `z.ZodArray`\<`z.ZodString`\>; `datasetNameA`: `z.ZodString`; `datasetNameB`: `z.ZodString`; `dbTableNameA`: `z.ZodString`; `dbTableNameB`: `z.ZodString`; `keyColumn`: `z.ZodOptional`\<`z.ZodString`\>; `mergeType`: `z.ZodEnum`\<\[`"horizontal"`, `"vertical"`\]\>; `sql`: `z.ZodString`; \}\>

Defined in: [packages/tools/duckdb/src/merge.ts:193](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/duckdb/src/merge.ts#L193)
