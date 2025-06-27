# Type Alias: ExecuteRoadsResult

> **ExecuteRoadsResult**: `object`

Defined in: [packages/tools/osm/src/roads.ts:283](https://github.com/GeoDaCenter/openassistant/blob/0f7bf760e453a1735df9463dc799b04ee2f630fd/packages/tools/osm/src/roads.ts#L283)

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
