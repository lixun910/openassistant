# Type Alias: ExecuteSpatialWeightsResult

> **ExecuteSpatialWeightsResult**: `object`

Defined in: [packages/tools/geoda/src/weights/tool.ts:161](https://github.com/GeoDaCenter/openassistant/blob/0f7bf760e453a1735df9463dc799b04ee2f630fd/packages/tools/geoda/src/weights/tool.ts#L161)

## Type declaration

### additionalData?

> `optional` **additionalData**: `object`

#### Index Signature

\[`id`: `string`\]: `unknown`

#### additionalData.weightsId

> **weightsId**: `string`

### llmResult

> **llmResult**: `object`

#### llmResult.error?

> `optional` **error**: `string`

#### llmResult.result?

> `optional` **result**: `string`

#### llmResult.success

> **success**: `boolean`

#### llmResult.weightsId?

> `optional` **weightsId**: `string`

#### llmResult.weightsMeta?

> `optional` **weightsMeta**: `WeightsMeta`
