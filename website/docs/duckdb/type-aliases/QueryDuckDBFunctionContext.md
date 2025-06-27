# Type Alias: QueryDuckDBFunctionContext

> **QueryDuckDBFunctionContext**: `object`

Defined in: [packages/tools/duckdb/src/query.ts:81](https://github.com/GeoDaCenter/openassistant/blob/0f7bf760e453a1735df9463dc799b04ee2f630fd/packages/tools/duckdb/src/query.ts#L81)

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
