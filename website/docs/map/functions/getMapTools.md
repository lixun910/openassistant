# Function: getMapTools()

> **getMapTools**(`toolContext`, `onToolCompleted`, `isExecutable`): `object`

Defined in: [packages/tools/map/src/register-tools.ts:155](https://github.com/GeoDaCenter/openassistant/blob/bc4037be52d89829440fcc4aaa1010be73719d16/packages/tools/map/src/register-tools.ts#L155)

Get all keplergl tools.

## Parameters

### toolContext

[`MapToolContext`](../type-aliases/MapToolContext.md)

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
