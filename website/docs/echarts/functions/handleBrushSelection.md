# Function: handleBrushSelection()

> **handleBrushSelection**(`eChart`, `brushed`, `datasetName`, `onSelected`?): `void`

Defined in: [packages/echarts/src/echarts-updater.tsx:33](https://github.com/GeoDaCenter/openassistant/blob/a9f2271d1019f6c25c10dd4b3bdb64fcf16999b2/packages/echarts/src/echarts-updater.tsx#L33)

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
