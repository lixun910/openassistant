# Type Alias: QueryDuckDBFunctionContext

> **QueryDuckDBFunctionContext**: `object`

Defined in: [packages/tools/duckdb/src/query.ts:81](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/duckdb/src/query.ts#L81)

The context of the queryDuckDB function.

## Type declaration

### config

> **config**: `object`

#### config.isDraggable?

> `optional` **isDraggable**: `boolean`

### duckDB?

> `optional` **duckDB**: `duckdb.AsyncDuckDB`

### getValues()

> **getValues**: (`datasetName`, `variableName`) => `Promise`\<`unknown`[]\>

#### Parameters

##### datasetName

`string`

##### variableName

`string`

#### Returns

`Promise`\<`unknown`[]\>

### onSelected?

> `optional` **onSelected**: `OnSelectedCallback`
