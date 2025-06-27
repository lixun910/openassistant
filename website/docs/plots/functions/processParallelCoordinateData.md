# Function: processParallelCoordinateData()

> **processParallelCoordinateData**(`rawData`): [`ParallelCoordinateDataProps`](../type-aliases/ParallelCoordinateDataProps.md)

Defined in: [packages/tools/plots/src/echarts/pcp/utils.ts:43](https://github.com/GeoDaCenter/openassistant/blob/0f7bf760e453a1735df9463dc799b04ee2f630fd/packages/tools/plots/src/echarts/pcp/utils.ts#L43)

Processes multiple variables to generate PCP data and raw data

## Parameters

### rawData

`RawDataType`

Object containing variable names as keys and their corresponding numeric values as arrays

## Returns

[`ParallelCoordinateDataProps`](../type-aliases/ParallelCoordinateDataProps.md)

Processed PCP data with statistical measures for each variable
