# Type Alias: SpatialJoinLlmResult

> **SpatialJoinLlmResult**: `object`

Defined in: [packages/tools/geoda/src/spatial\_join/tool.ts:29](https://github.com/GeoDaCenter/openassistant/blob/0f7bf760e453a1735df9463dc799b04ee2f630fd/packages/tools/geoda/src/spatial_join/tool.ts#L29)

## Type declaration

### datasetName?

> `optional` **datasetName**: `string`

### error?

> `optional` **error**: `string`

### firstTwoRows?

> `optional` **firstTwoRows**: `object`[]

#### Index Signature

\[`x`: `string`\]: (`string` \| `number`)[]

### joinStats?

> `optional` **joinStats**: `object`

#### joinStats.averageCount

> **averageCount**: `number`

#### joinStats.maxCount

> **maxCount**: `number`

#### joinStats.minCount

> **minCount**: `number`

#### joinStats.totalCount

> **totalCount**: `number`

### result?

> `optional` **result**: `string`

### success

> **success**: `boolean`
