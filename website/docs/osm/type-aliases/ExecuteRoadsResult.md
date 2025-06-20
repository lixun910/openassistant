# Type Alias: ExecuteRoadsResult

> **ExecuteRoadsResult**: `object`

Defined in: [packages/tools/osm/src/roads.ts:283](https://github.com/GeoDaCenter/openassistant/blob/37d127dc7a76d6b5cf9de906c055e4c904e3dfed/packages/tools/osm/src/roads.ts#L283)

## Type declaration

### additionalData?

> `optional` **additionalData**: `object`

#### additionalData.boundary

> **boundary**: `string`

#### additionalData.geojson

> **geojson**: `GeoJSON.FeatureCollection`

#### additionalData.roadType

> **roadType**: `string`

### llmResult

> **llmResult**: `object`

#### llmResult.error?

> `optional` **error**: `string`

#### llmResult.result?

> `optional` **result**: `GeoJSON.FeatureCollection`

#### llmResult.success

> **success**: `boolean`
