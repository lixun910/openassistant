# Function: handleBrushSelection()

> **handleBrushSelection**(`eChart`, `brushed`, `datasetName`, `onSelected`?): `void`

Defined in: [echarts-updater.tsx:33](https://github.com/GeoDaCenter/openassistant/blob/a1bcfdf89aac2d64b3bda9cf92b96ead076def28/packages/echarts/src/echarts-updater.tsx#L33)

Handles brush selection events from ECharts components.
Manages highlighting and callback execution for brushed data points.

## Parameters

### eChart

ECharts instance

`undefined` | `EChartsType`

### brushed

`number`[]

Array of indices that are currently brushed

### datasetName

`string`

Name of the dataset being brushed

### onSelected?

`OnBrushedCallback`

Optional callback function to handle brush selection

## Returns

`void`
