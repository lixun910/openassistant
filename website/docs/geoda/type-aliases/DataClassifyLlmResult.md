# Type Alias: DataClassifyLlmResult

> **DataClassifyLlmResult**: `object`

Defined in: [packages/tools/geoda/src/data-classify/tool.ts:32](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/geoda/src/data-classify/tool.ts#L32)

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
