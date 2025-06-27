# Type Alias: ExecuteGeocodingResult

> **ExecuteGeocodingResult**: `object`

Defined in: [packages/tools/osm/src/geocoding.ts:124](https://github.com/GeoDaCenter/openassistant/blob/0f7bf760e453a1735df9463dc799b04ee2f630fd/packages/tools/osm/src/geocoding.ts#L124)

## Type declaration

### additionalData?

> `optional` **additionalData**: `object`

#### additionalData.address

> **address**: `string`

#### additionalData.geojson

> **geojson**: `GeoJSON.FeatureCollection`

### llmResult

> **llmResult**: `object`

#### llmResult.error?

> `optional` **error**: `string`

#### llmResult.result?

> `optional` **result**: `GeoJSON.FeatureCollection`

#### llmResult.success

> **success**: `boolean`
