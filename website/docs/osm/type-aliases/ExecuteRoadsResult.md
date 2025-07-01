# Type Alias: ExecuteRoadsResult

> **ExecuteRoadsResult**: `object`

Defined in: [packages/tools/osm/src/roads.ts:283](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/osm/src/roads.ts#L283)

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
