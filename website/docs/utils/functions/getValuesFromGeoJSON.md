# Function: getValuesFromGeoJSON()

> **getValuesFromGeoJSON**(`geojson`, `propertyName`): `unknown`[]

Defined in: [geojson.ts:9](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/geojson.ts#L9)

Extracts values for a specific property from a GeoJSON Feature or FeatureCollection

## Parameters

### geojson

The GeoJSON data (Feature or FeatureCollection)

`FeatureCollection`\<`Geometry`, `GeoJsonProperties`\> | `Feature`\<`Geometry`, `GeoJsonProperties`\>

### propertyName

`string`

The name of the property to extract values from

## Returns

`unknown`[]

Array of values for the specified property
