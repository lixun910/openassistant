# Type Alias: LocalQueryResult

> **LocalQueryResult**: `object`

Defined in: [packages/tools/duckdb/src/types.ts:39](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/duckdb/src/types.ts#L39)

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
