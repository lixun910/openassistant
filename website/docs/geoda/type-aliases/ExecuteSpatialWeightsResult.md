# Type Alias: ExecuteSpatialWeightsResult

> **ExecuteSpatialWeightsResult**: `object`

Defined in: [packages/tools/geoda/src/weights/tool.ts:158](https://github.com/GeoDaCenter/openassistant/blob/28e38a23cf528ccfe10391135d12fba8d3e385da/packages/tools/geoda/src/weights/tool.ts#L158)

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
