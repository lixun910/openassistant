# Type Alias: CreateBoxplotProps

> **CreateBoxplotProps**: `object`

Defined in: [packages/tools/plots/src/echarts/boxplot/utils.ts:14](https://github.com/GeoDaCenter/openassistant/blob/37d127dc7a76d6b5cf9de906c055e4c904e3dfed/packages/tools/plots/src/echarts/boxplot/utils.ts#L14)

Properties required to create a boxplot visualization

## Type declaration

### boundIQR

> **boundIQR**: `number`

Multiplier for the IQR to determine the whisker lengths
Common values are 1.5 (default) or 3.0

### data

> **data**: `object`

Input data object where each key represents a group/category and the value is an array of numbers

#### Index Signature

\[`key`: `string`\]: `number`[]
