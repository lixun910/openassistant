# Function: chowTest()

> **chowTest**(`x1`, `y1`, `x2`, `y2`): [`ChowTestResult`](../type-aliases/ChowTestResult.md)

Defined in: [packages/tools/plots/src/echarts/math/linear-regression.ts:340](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/plots/src/echarts/math/linear-regression.ts#L340)

Perform the Chow test to check if the regression is different between the first and second subset.

## Parameters

### x1

`number`[]

The first subset x values.

### y1

`number`[]

The first subset y values.

### x2

`number`[]

The second subset x values.

### y2

`number`[]

The second subset y values.

## Returns

[`ChowTestResult`](../type-aliases/ChowTestResult.md)

The results of the Chow test. See [ChowTestResult](../type-aliases/ChowTestResult.md) for more details.
