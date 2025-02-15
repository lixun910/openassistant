# Type Alias: ChowTestResult

> **ChowTestResult**: `object`

Defined in: [math/linear-regression.ts:298](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/echarts/src/math/linear-regression.ts#L298)

Performs Chow test to check for structural break in linear regression
The fStat is the F-statistic and the pValue is the p-value.
If the pValue is less than 0.05, we can reject the null hypothesis and conclude that the regression is different between the first and second subset.
The larger the fStat, the more significant the difference between the two subsets.

## Type declaration

### fStat

> **fStat**: `number`

### pValue

> **pValue**: `number`

## Param

First subset x values

## Param

First subset y values

## Param

Second subset x values

## Param

Second subset y values

## Returns

Object containing F-statistic and p-value
