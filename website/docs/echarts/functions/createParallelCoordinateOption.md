# Function: createParallelCoordinateOption()

> **createParallelCoordinateOption**(`props`): `EChartsOption`

Defined in: [pcp/component/pcp-option.ts:61](https://github.com/GeoDaCenter/openassistant/blob/f1f258826ab8e671a18170ebc60cc2939607e736/packages/echarts/src/pcp/component/pcp-option.ts#L61)

Creates a parallel coordinate option configuration for the PCP (Parallel Coordinates Plot) chart.

## Parameters

### props

[`PcpChartOptionProps`](../type-aliases/PcpChartOptionProps.md)

Configuration properties for the parallel coordinate chart

## Returns

`EChartsOption`

An ECharts option configuration object for parallel coordinates visualization with:
         - Parallel axis configuration
         - Brushing interaction setup
         - Series styling and data mapping
         - Layout and grid settings

## Example

```ts
const option = createParallelCoordinateOption({
  pcp: parallelCoordProps,
  rawData: {
    'population': [100, 200, 300],
    'income': [50000, 60000, 70000]
  },
  theme: 'light',
  isExpanded: false
});
```
