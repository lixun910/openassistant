# Type Alias: BoxplotDataProps

> **BoxplotDataProps**: `object`

Defined in: [packages/tools/plots/src/echarts/boxplot/utils.ts:55](https://github.com/GeoDaCenter/openassistant/blob/37d127dc7a76d6b5cf9de906c055e4c904e3dfed/packages/tools/plots/src/echarts/boxplot/utils.ts#L55)

Output data structure compatible with eCharts boxplot series

## Type declaration

### boxplots

> **boxplots**: [`BoxplotProps`](BoxplotProps.md)[]

Array of boxplot statistical properties for each data group

### meanPoint

> **meanPoint**: \[`string`, `number`\][]

Array of [groupName, meanValue] pairs for rendering mean points
