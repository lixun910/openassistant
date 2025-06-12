# Type Alias: MergeTablesArgs

> **MergeTablesArgs**: `z.ZodObject`\<\{ `columnNamesA`: `z.ZodArray`\<`z.ZodString`\>; `columnNamesB`: `z.ZodArray`\<`z.ZodString`\>; `datasetNameA`: `z.ZodString`; `datasetNameB`: `z.ZodString`; `dbTableNameA`: `z.ZodString`; `dbTableNameB`: `z.ZodString`; `keyColumn`: `z.ZodOptional`\<`z.ZodString`\>; `mergeType`: `z.ZodEnum`\<\[`"horizontal"`, `"vertical"`\]\>; `sql`: `z.ZodString`; \}\>

Defined in: [packages/tools/duckdb/src/merge.ts:193](https://github.com/GeoDaCenter/openassistant/blob/dc72d81a35cf8e46295657303846fbb4ad891993/packages/tools/duckdb/src/merge.ts#L193)
