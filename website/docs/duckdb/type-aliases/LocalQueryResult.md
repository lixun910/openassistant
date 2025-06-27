# Type Alias: LocalQueryResult

> **LocalQueryResult**: `object`

Defined in: [packages/tools/duckdb/src/types.ts:39](https://github.com/GeoDaCenter/openassistant/blob/0f7bf760e453a1735df9463dc799b04ee2f630fd/packages/tools/duckdb/src/types.ts#L39)

Combined result type for localQuery

## Type declaration

### additionalData?

> `optional` **additionalData**: [`LocalQueryAdditionalData`](LocalQueryAdditionalData.md)

### llmResult

> **llmResult**: `object`

#### llmResult.datasetName?

> `optional` **datasetName**: `string`

#### llmResult.error?

> `optional` **error**: `string`

#### llmResult.firstRow?

> `optional` **firstRow**: `Record`\<`string`, `unknown`\>

#### llmResult.instruction?

> `optional` **instruction**: `string`

#### llmResult.success

> **success**: `boolean`
