# Plots Tools

The `@openassistant/plots` package provides tools for creating statistical visualizations using ECharts and Vega-Lite.

## Installation

```bash
npm install @openassistant/plots
```

## Available Tools

### ECharts Tools

- **`histogram`** - Create histograms to show data distributions
- **`scatterplot`** - Create scatter plots to show relationships between variables
- **`boxplot`** - Create box plots to show statistical distributions
- **`bubbleChart`** - Create bubble charts with three dimensions
- **`pcp`** - Create parallel coordinate plots for multivariate analysis

### Vega-Lite Tool

- **`vegalite`** - Create Vega-Lite specifications for custom visualizations

## Basic Usage

### Histogram

```typescript
import { histogram } from '@openassistant/plots';
import { HistogramComponent } from '@openassistant/echarts';
import { Assistant, type AssistantOptions } from '@openassistant/assistant';

const DATASETS = {
  cities: [
    { name: 'San Francisco', population: 800000 },
    { name: 'New York', population: 8400000 },
    { name: 'Los Angeles', population: 3900000 },
    { name: 'Chicago', population: 2700000 },
    // ...more cities
  ],
};

const histogramTool = {
  ...histogram,
  context: {
    getValues: async (datasetName: string, variableName: string) => {
      // Get the values of the variable from dataset
      return DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
  component: HistogramComponent,
};

const config: AssistantOptions = {
  ai: {
    getInstructions: () => `
      You can create histograms from datasets.
      Available dataset: cities with fields: name, population
    `,
    tools: {
      histogram: histogramTool,
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

### Scatter Plot

```typescript
import { scatterplot } from '@openassistant/plots';
import { ScatterplotComponent } from '@openassistant/echarts';
import { Assistant } from '@openassistant/assistant';

const DATASETS = {
  cities: [
    { name: 'City A', income: 50000, housing_price: 400000 },
    { name: 'City B', income: 75000, housing_price: 600000 },
    { name: 'City C', income: 60000, housing_price: 500000 },
    // ...more cities
  ],
};

const scatterplotTool = {
  ...scatterplot,
  context: {
    getValues: async (datasetName: string, variableName: string) => {
      return DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
  component: ScatterplotComponent,
};

const config = {
  ai: {
    getInstructions: () => `
      You can create scatter plots from datasets.
      Available dataset: cities with fields: name, income, housing_price
    `,
    tools: {
      scatterplot: scatterplotTool,
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

### Box Plot

```typescript
import { boxplot } from '@openassistant/plots';
import { BoxplotComponent } from '@openassistant/echarts';
import { Assistant } from '@openassistant/assistant';

const DATASETS = {
  sales: [
    { region: 'North', revenue: 100000 },
    { region: 'North', revenue: 120000 },
    { region: 'South', revenue: 90000 },
    { region: 'South', revenue: 95000 },
    // ...more sales data
  ],
};

const boxplotTool = {
  ...boxplot,
  context: {
    getValues: async (datasetName: string, variableName: string) => {
      return DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
  component: BoxplotComponent,
};

const config = {
  ai: {
    getInstructions: () => `
      You can create box plots from datasets.
      Available dataset: sales with fields: region, revenue
    `,
    tools: {
      boxplot: boxplotTool,
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

## Usage with Vercel AI SDK

```typescript
import { scatterplot } from '@openassistant/plots';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const scatterplotTool = {
  ...scatterplot,
  context: {
    getValues: async (datasetName: string, variableName: string) => {
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
};

const result = await generateText({
  model: openai('gpt-4'),
  prompt: 'What is the relationship between income and housing price in the cities dataset?',
  tools: {
    scatterplot: convertToVercelAiTool(scatterplotTool),
  },
});

console.log(result.text);
```

## Advanced Features

### Scatter Plot with Regression

The scatter plot tool automatically computes linear regression statistics:

```typescript
const scatterplotTool = {
  ...scatterplot,
  context: {
    getValues: async (datasetName, variableName) => {
      return DATASETS[datasetName].map((item) => item[variableName]);
    },
    config: {
      showRegressionLine: true, // Show regression line (default: true)
      showLoess: false,         // Show LOESS smoothing (default: false)
      theme: 'light',           // 'light' or 'dark'
      isDraggable: false,       // Allow dragging (default: false)
      isExpanded: false,        // Start expanded (default: false)
    },
  },
};
```

### Interactive Selection

All ECharts tools support interactive selection callbacks:

```typescript
const histogramTool = {
  ...histogram,
  context: {
    getValues: async (datasetName, variableName) => {
      return DATASETS[datasetName].map((item) => item[variableName]);
    },
    onSelected: (selectedIndices: number[]) => {
      console.log('Selected data points:', selectedIndices);
      // Handle selection - e.g., highlight on map, filter table, etc.
    },
  },
};
```

## Context Options

All plot tools use the `EChartsToolContext` interface:

```typescript
type EChartsToolContext = {
  // Required: Get values of a variable from dataset
  getValues: (datasetName: string, variableName: string) => Promise<unknown[]>;
  
  // Optional: Handle selection events
  onSelected?: (selectedIndices: number[]) => void;
  
  // Optional: Configuration options
  config?: {
    isDraggable?: boolean;  // Allow dragging charts
    isExpanded?: boolean;   // Start charts expanded
    theme?: 'light' | 'dark'; // Chart theme
    showRegressionLine?: boolean; // For scatterplot
    showLoess?: boolean;    // For scatterplot
  };
};
```

## Tool Parameters

### Histogram Parameters

```typescript
{
  datasetName: string;
  variableName: string;
  numberOfBins?: number; // Default: 5
}
```

### Scatterplot Parameters

```typescript
{
  datasetName: string;
  xVariableName: string;
  yVariableName: string;
}
```

### Boxplot Parameters

```typescript
{
  datasetName: string;
  variableName: string;
  groupByVariableName?: string; // Optional: group by category
}
```

### Bubble Chart Parameters

```typescript
{
  datasetName: string;
  xVariableName: string;
  yVariableName: string;
  sizeVariableName: string;
  colorVariableName?: string; // Optional
}
```

### Parallel Coordinate Plot Parameters

```typescript
{
  datasetName: string;
  variableNames: string[]; // Array of variables to include
}
```

## Example User Prompts

The AI can respond to natural language prompts like:

- "Create a histogram of population with 10 bins"
- "Show me a scatter plot of income vs housing price"
- "Make a box plot of revenue grouped by region"
- "What is the correlation between income and housing price?"
- "Show the distribution of ages in the dataset"

## Complete Example

```typescript
import { histogram, scatterplot, boxplot } from '@openassistant/plots';
import { HistogramComponent, ScatterplotComponent, BoxplotComponent } from '@openassistant/echarts';
import { Assistant, type AssistantOptions } from '@openassistant/assistant';

const DATASETS = {
  cities: [
    { name: 'SF', population: 800000, income: 75000, housing: 900000, region: 'West' },
    { name: 'NY', population: 8400000, income: 65000, housing: 700000, region: 'East' },
    { name: 'LA', population: 3900000, income: 60000, housing: 600000, region: 'West' },
    // ...more cities
  ],
};

const histogramTool = {
  ...histogram,
  context: {
    getValues: async (datasetName, variableName) => {
      return DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
  component: HistogramComponent,
};

const scatterplotTool = {
  ...scatterplot,
  context: {
    getValues: async (datasetName, variableName) => {
      return DATASETS[datasetName].map((item) => item[variableName]);
    },
    config: {
      showRegressionLine: true,
    },
  },
  component: ScatterplotComponent,
};

const boxplotTool = {
  ...boxplot,
  context: {
    getValues: async (datasetName, variableName) => {
      return DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
  component: BoxplotComponent,
};

const config: AssistantOptions = {
  ai: {
    getInstructions: () => `
      You are a data analyst assistant.
      Available dataset: cities
      Fields: name, population, income, housing, region
    `,
    tools: {
      histogram: histogramTool,
      scatterplot: scatterplotTool,
      boxplot: boxplotTool,
    },
  },
};

export function App() {
  return <Assistant options={config} />;
}
```

## Statistical Features

### Scatterplot Regression

The scatterplot tool automatically computes:

- Linear regression coefficients (slope, intercept)
- R-squared value
- P-values and standard errors
- T-statistics

These statistics are included in the `additionalData` and reported to the AI.

### Box Plot Statistics

The boxplot tool computes:

- Median, Q1, Q3
- Min and max values
- Outliers
- Whisker bounds

## API Reference

For detailed API documentation, see the [Plots API Reference](/api/@openassistant/plots/README).

## Next Steps

- [DuckDB Tools](/guide/tools/duckdb) - Query data before visualization
- [GeoDA Tools](/guide/tools/geoda) - Spatial statistics and analysis
- [Map Tools](/guide/tools/map) - Combine charts with maps
