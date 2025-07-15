# Function: getBoundsFromGeoJSON()

> **getBoundsFromGeoJSON**(`geoJsonData`): `object`

Defined in: [geojson.ts:38](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/geojson.ts#L38)

Get bounds and zoom level from GeoJSON data that encompasses all geometries

## Parameters

### geoJsonData

GeoJSON FeatureCollection or Feature

`FeatureCollection`\<`Geometry`, `GeoJsonProperties`\> | `Feature`\<`Geometry`, `GeoJsonProperties`\>

## Returns

`object`

Object containing bounds [[minLat, minLng], [maxLat, maxLng]] and zoom level

### bounds

> **bounds**: \[\[`number`, `number`\], \[`number`, `number`\]\]

### zoom

> **zoom**: `number`
