# Function: onBrushSelected()

> **onBrushSelected**(`params`, `id`, `datasetName`, `eChart`?, `onSelected`?): `void`

Defined in: [packages/echarts/src/echarts-updater.tsx:61](https://github.com/GeoDaCenter/openassistant/blob/95db62ddd98ea06cccc7750f9f0e37556d8bf20e/packages/echarts/src/echarts-updater.tsx#L61)

Handles the brush selection event from ECharts and processes the selected data indices.

## Parameters

### params

The brush selection event parameters from ECharts

#### batch

`object`[]

Array of batch selection data containing selected data indices

### id

`string`

The identifier for the chart instance

### datasetName

`string`

Name of the dataset being visualized

### eChart?

`EChartsType`

Optional ECharts instance reference

### onSelected?

`OnBrushedCallback`

Optional callback function to handle brush selection

## Returns

`void`
