# Interface: LocalQueryContext

Defined in: packages/duckdb/src/types.ts:22

Context object for the localQuery tool

## Properties

### config?

> `optional` **config**: `object`

Defined in: packages/duckdb/src/types.ts:46

Configuration options

#### Index Signature

\[`key`: `string`\]: `unknown`

#### isDraggable?

> `optional` **isDraggable**: `boolean`

***

### duckDB?

> `optional` **duckDB**: `null` \| `AsyncDuckDB`

Defined in: packages/duckdb/src/types.ts:54

Optional DuckDB instance for querying

***

### getValues()

> **getValues**: (`datasetName`, `variableName`) => `unknown`[]

Defined in: packages/duckdb/src/types.ts:29

Function to get values from a dataset

#### Parameters

##### datasetName

`string`

The name of the dataset

##### variableName

`string`

The name of the variable to get values for

#### Returns

`unknown`[]

An array of values for the specified variable

***

### onSelected()?

> `optional` **onSelected**: (`datasetName`, `columnName`, `selectedValues`) => `void`

Defined in: packages/duckdb/src/types.ts:37

Function called when values are selected in the query result

#### Parameters

##### datasetName

`string`

The name of the dataset

##### columnName

`string`

The name of the column

##### selectedValues

`unknown`[]

The selected values

#### Returns

`void`
