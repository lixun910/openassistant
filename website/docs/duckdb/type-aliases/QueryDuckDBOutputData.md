# Type Alias: QueryDuckDBOutputData

> **QueryDuckDBOutputData**: `object`

Defined in: [packages/duckdb/src/queryTable.tsx:23](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/duckdb/src/queryTable.tsx#L23)

## Type declaration

### columnData

> **columnData**: `object`

#### Index Signature

\[`key`: `string`\]: `unknown`[]

### datasetName

> **datasetName**: `string`

### db?

> `optional` **db**: `duckdb.AsyncDuckDB`

### dbTableName

> **dbTableName**: `string`

### isDraggable?

> `optional` **isDraggable**: `boolean`

### onSelected()?

> `optional` **onSelected**: (`datasetName`, `columnName`, `selectedValues`) => `void`

#### Parameters

##### datasetName

`string`

##### columnName

`string`

##### selectedValues

`unknown`[]

#### Returns

`void`

### sql

> **sql**: `string`

### variableNames

> **variableNames**: `string`[]
