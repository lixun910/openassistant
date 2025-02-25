# Function: createBubbleChartOption()

> **createBubbleChartOption**(`props`): `EChartsOption`

Defined in: [bubble-chart/component/bubble-chart-option.ts:35](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/echarts/src/bubble-chart/component/bubble-chart-option.ts#L35)

Creates an ECharts option configuration for rendering a bubble chart.

## Parameters

### props

[`BubbleChartOutputData`](../type-aliases/BubbleChartOutputData.md)

The input data for the bubble chart

## Returns

`EChartsOption`

An ECharts option configuration object that defines:
- Scatter plot with variable-sized bubbles
- Customizable bubble colors
- Interactive tooltips showing data points' details
- Brush selection tools
- Responsive grid layout
- Optimized animation settings for performance

## Example

```ts
const data = {
  variableX: { name: 'GDP', values: [1000, 2000, 3000] },
  variableY: { name: 'Life Expectancy', values: [70, 75, 80] },
  variableSize: { name: 'Population', values: [1000000, 2000000, 3000000] },
  variableColor: { name: 'Region', values: ['A', 'B', 'C'] }
};
const option = createBubbleChartOption({ data });
```
