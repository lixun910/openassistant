# Variable: spatialFilter

> `const` **spatialFilter**: `object`

Defined in: [packages/tools/geoda/src/spatial\_join/spatial-filter.ts:3](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/geoda/src/spatial_join/spatial-filter.ts#L3)

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
