# Function: BubbleChartComponent()

> **BubbleChartComponent**(`props`): `null` \| `Element`

Defined in: [packages/echarts/src/bubble-chart/component/bubble-chart-component.tsx:36](https://github.com/GeoDaCenter/openassistant/blob/a9f2271d1019f6c25c10dd4b3bdb64fcf16999b2/packages/echarts/src/bubble-chart/component/bubble-chart-component.tsx#L36)

A React component that renders an interactive bubble chart visualization.

## Parameters

### props

[`BubbleChartOutputData`](../type-aliases/BubbleChartOutputData.md)

BubbleChartOutputData - The configuration and data for the bubble chart:
  - datasetName: string - The name of the dataset being visualized
  - data: object - The chart data containing:
    - variableX: number[] - X-axis values for each bubble
    - variableY: number[] - Y-axis values for each bubble
    - variableSize: number[] - Size values for each bubble
    - variableColor?: (number | string)[] - Optional color values for each bubble
  - theme?: string - Optional theme setting for the chart
  - isExpanded?: boolean - Optional flag to control chart expansion state
  - isDraggable?: boolean - Optional flag to enable/disable drag functionality

## Returns

`null` \| `Element`

A responsive bubble chart wrapped in an auto-sizing container

## Example

```ts
<BubbleChartComponent
  datasetName="Sample Dataset"
  data={{
    variableX: [1, 2, 3],
    variableY: [4, 5, 6],
    variableSize: [10, 20, 30],
    variableColor: ['#ff0000', '#00ff00', '#0000ff']
  }}
/>
```
