# Function: calculateLoessRegression()

> **calculateLoessRegression**(`xData`, `yData`, `bandwidth`, `steps`, `confidenceLevel`): [`LoessResult`](../type-aliases/LoessResult.md)

Defined in: [packages/echarts/src/math/linear-regression.ts:211](https://github.com/GeoDaCenter/openassistant/blob/ae6e39c15b60e7a98a21d90a5bbeff5dc44c1295/packages/echarts/src/math/linear-regression.ts#L211)

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
