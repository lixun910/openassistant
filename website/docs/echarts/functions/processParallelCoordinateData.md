# Function: processParallelCoordinateData()

> **processParallelCoordinateData**(`rawData`): [`ParallelCoordinateDataProps`](../type-aliases/ParallelCoordinateDataProps.md)

Defined in: [packages/echarts/src/pcp/utils.ts:43](https://github.com/GeoDaCenter/openassistant/blob/2c7e2a603db0fcbd6603996e5ea15006191c5f7f/packages/echarts/src/pcp/utils.ts#L43)

Processes multiple variables to generate PCP data and raw data

## Parameters

### rawData

`RawDataType`

Object containing variable names as keys and their corresponding numeric values as arrays

## Returns

[`ParallelCoordinateDataProps`](../type-aliases/ParallelCoordinateDataProps.md)

Processed PCP data with statistical measures for each variable
