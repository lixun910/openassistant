# Function: getOsmTools()

> **getOsmTools**(`toolContext`, `onToolCompleted`, `isExecutable`): `object`

Defined in: [packages/tools/osm/src/register-tools.ts:133](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/osm/src/register-tools.ts#L133)

Get all OSM tools.

## Parameters

### toolContext

[`MapboxToolContext`](../type-aliases/MapboxToolContext.md)

The tool context, which is required for some tools e.g. routing, isochrone, etc.

### onToolCompleted

`OnToolCompleted`

The callback function to handle the tool completion and get the output data from the tool call

### isExecutable

`boolean` = `true`

Whether the tool is executable e.g. on the server side, default to true. If false, you need to execute the tool on the client side.

## Returns

`object`

The tools
