# Function: calculateLoessRegression()

> **calculateLoessRegression**(`xData`, `yData`, `bandwidth`, `steps`, `confidenceLevel`): [`LoessResult`](../type-aliases/LoessResult.md)

Defined in: [math/linear-regression.ts:211](https://github.com/GeoDaCenter/openassistant/blob/a1bcfdf89aac2d64b3bda9cf92b96ead076def28/packages/echarts/src/math/linear-regression.ts#L211)

Calculate the loess regression.

## Parameters

### xData

`number`[]

The x data.

### yData

`number`[]

The y data.

### bandwidth

`number` = `0.2`

The bandwidth.

### steps

`number` = `100`

The number of steps.

### confidenceLevel

`number` = `0.95`

The confidence level.

## Returns

[`LoessResult`](../type-aliases/LoessResult.md)

The results of the loess regression. See [LoessResult](../type-aliases/LoessResult.md) for more details.
