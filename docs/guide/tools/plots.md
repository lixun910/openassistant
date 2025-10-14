# Plots Tools

The `@openassistant/plots` package provides tools for creating statistical visualizations using ECharts and Vega-Lite.

## Installation

```bash
npm install @openassistant/plots
```

## Available Tools

### ECharts Tools

- **HistogramTool** - Create histograms
- **ScatterplotTool** - Create scatter plots
- **BoxplotTool** - Create box plots
- **BubbleChartTool** - Create bubble charts
- **PCPTool** - Create parallel coordinate plots

### Vega-Lite Tool

- **VegaLiteTool** - Create Vega-Lite specifications

## Basic Usage

### Histogram

```typescript
import { HistogramTool } from '@openassistant/plots';

const histogramTool = new HistogramTool({
  context: {
    getData: async (datasetName, variable) => {
      return await fetchData(datasetName, variable);
    },
  },
});

const result = await histogramTool.execute({
  dataset: 'cities',
  variable: 'population',
  bins: 10
});

console.log('Histogram config:', result.config);
```

### Scatter Plot

```typescript
import { ScatterplotTool } from '@openassistant/plots';

const scatterTool = new ScatterplotTool({
  context: {
    getData: async (datasetName) => {
      return await fetchData(datasetName);
    },
  },
});

const result = await scatterTool.execute({
  dataset: 'cities',
  xField: 'income',
  yField: 'housing_price',
  colorField: 'region'
});
```

## API Reference

For detailed API documentation, see the [Plots API Reference](/api/@openassistant/plots/README).

