# Type Alias: ExecuteGeocodingResult

> **ExecuteGeocodingResult**: `object`

Defined in: [packages/tools/osm/src/geocoding.ts:124](https://github.com/GeoDaCenter/openassistant/blob/bc4037be52d89829440fcc4aaa1010be73719d16/packages/tools/osm/src/geocoding.ts#L124)

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
