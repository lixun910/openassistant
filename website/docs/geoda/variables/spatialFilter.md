# Variable: spatialFilter

> `const` **spatialFilter**: `object`

Defined in: [packages/tools/geoda/src/spatial\_join/spatial-filter.ts:3](https://github.com/GeoDaCenter/openassistant/blob/37d127dc7a76d6b5cf9de906c055e4c904e3dfed/packages/tools/geoda/src/spatial_join/spatial-filter.ts#L3)

## Type declaration

### component?

> `optional` **component**: `ElementType`\<`any`, keyof IntrinsicElements\>

### context?

> `optional` **context**: [`SpatialJoinFunctionContext`](../type-aliases/SpatialJoinFunctionContext.md)

### description

> **description**: `string`

### execute

> **execute**: `ExecuteFunction`\<[`SpatialJoinFunctionArgs`](../type-aliases/SpatialJoinFunctionArgs.md), [`SpatialJoinLlmResult`](../type-aliases/SpatialJoinLlmResult.md), [`SpatialJoinAdditionalData`](../type-aliases/SpatialJoinAdditionalData.md), [`SpatialJoinFunctionContext`](../type-aliases/SpatialJoinFunctionContext.md)\>

### onToolCompleted?

> `optional` **onToolCompleted**: `OnToolCompleted`

### parameters

> **parameters**: [`SpatialJoinFunctionArgs`](../type-aliases/SpatialJoinFunctionArgs.md)
