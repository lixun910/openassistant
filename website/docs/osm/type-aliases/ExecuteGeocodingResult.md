# Type Alias: ExecuteGeocodingResult

> **ExecuteGeocodingResult**: `object`

Defined in: [packages/tools/osm/src/geocoding.ts:124](https://github.com/GeoDaCenter/openassistant/blob/37d127dc7a76d6b5cf9de906c055e4c904e3dfed/packages/tools/osm/src/geocoding.ts#L124)

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
