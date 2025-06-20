# Type Alias: DataClassifyLlmResult

> **DataClassifyLlmResult**: `object`

Defined in: [packages/tools/geoda/src/data-classify/tool.ts:32](https://github.com/GeoDaCenter/openassistant/blob/37d127dc7a76d6b5cf9de906c055e4c904e3dfed/packages/tools/geoda/src/data-classify/tool.ts#L32)

## Type declaration

### error?

> `optional` **error**: `string`

### instruction?

> `optional` **instruction**: `string`

### result?

> `optional` **result**: `object`

#### result.breaks

> **breaks**: `number`[]

#### result.datasetName

> **datasetName**: `string`

#### result.hinge?

> `optional` **hinge**: `number`

#### result.k?

> `optional` **k**: `number`

#### result.method

> **method**: `string`

#### result.variableName

> **variableName**: `string`

### success

> **success**: `boolean`
