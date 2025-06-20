# Function: calculateLoessRegression()

> **calculateLoessRegression**(`xData`, `yData`, `bandwidth`, `steps`, `confidenceLevel`): [`LoessResult`](../type-aliases/LoessResult.md)

Defined in: [packages/tools/plots/src/echarts/math/linear-regression.ts:211](https://github.com/GeoDaCenter/openassistant/blob/37d127dc7a76d6b5cf9de906c055e4c904e3dfed/packages/tools/plots/src/echarts/math/linear-regression.ts#L211)

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
