# Type Alias: DataClassifyLlmResult

> **DataClassifyLlmResult**: `object`

Defined in: [packages/tools/geoda/src/data-classify/tool.ts:32](https://github.com/GeoDaCenter/openassistant/blob/bc4037be52d89829440fcc4aaa1010be73719d16/packages/tools/geoda/src/data-classify/tool.ts#L32)

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
