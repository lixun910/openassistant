# Type Alias: ExecuteSpatialWeightsResult

> **ExecuteSpatialWeightsResult**: `object`

Defined in: [packages/tools/geoda/src/weights/tool.ts:158](https://github.com/GeoDaCenter/openassistant/blob/37d127dc7a76d6b5cf9de906c055e4c904e3dfed/packages/tools/geoda/src/weights/tool.ts#L158)

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
