# Function: createHistogramBins()

> **createHistogramBins**(`values`, `numberOfBins`): `object`

Defined in: [packages/echarts/src/histogram/component/utils.ts:10](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/echarts/src/histogram/component/utils.ts#L10)

Create histogram bins.

## Parameters

### values

`number`[]

The values of the variable.

### numberOfBins

`number` = `5`

The number of bins to create.

## Returns

`object`

The histogram bins.

### barDataIndexes

> **barDataIndexes**: `number`[][]

### breaks

> **breaks**: `number`[]

### counts

> **counts**: `number`[]

### histogramData

> **histogramData**: [`HistogramDataProps`](../type-aliases/HistogramDataProps.md)[]

### indices

> **indices**: `number`[][]
