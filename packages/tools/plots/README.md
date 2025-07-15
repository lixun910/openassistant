# @openassistant/plots

The plot tools for OpenAssistant provides powerful visualization capabilities using [Vega-Lite](https://vega.github.io/vega-lite/) and [Apache ECharts](https://echarts.apache.org/).

<img src="https://openassistant-doc.vercel.app/img/histogram-1-400.png" width="400" alt="Histogram Plugin" />

## Features

| Tool Name                                                        | Description                                                                                                                                                                |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [vegaLitePlot](/docs/plots/variables/vegaLitePlot)               | create a Vega-Lite plot, e.g. bar chart, line chart, scatter plot, etc. from a dataset. The vega-lite plots are listed [here](https://vega.github.io/vega-lite/examples/). |
| **Interactive Plots**                                            | create a eCharts plot that can be interactive with other components e.g. map, table, etc.                                                                                  |
| [histogram](/docs/plots/variables/histogram)                     | create a histogram plot from a dataset                                                                                                                                     |
| [scatterplot](/docs/plots/variables/scatterplot)                 | create a scatter plot from a dataset                                                                                                                                       |
| [parallelCoordinates](/docs/plots/variables/parallelCoordinates) | create a parallel coordinates plot from a dataset                                                                                                                          |
| [boxplot](/docs/plots/variables/boxplot)                         | create a box plot from a dataset                                                                                                                                           |
| [bubblechart](/docs/plots/variables/bubblechart)                 | create a bubble chart from a dataset                                                                                                                                       |

## Installation

```bash
npm install @openassistant/plots @openassistant/utils ai
```

## Quick Start

Suppose you have a dataset which could be fetched from your data API. The json data could look like this:

```json
const SAMPLE_DATASETS = {
  myVenues: [
    { "location": "New York", "latitude": 40.7128, "longitude": -74.0060, "revenue": 12500000, "population": 8400000 },
    ...
  ]
};
```

Share the meta data of your dataset in the system prompt, so the LLM can understand which datasets are available to use when creating a plot.

:::note
The meta data is good enough for the AI assistant. Don't put the entire dataset in the context, and there is no need to share your dataset with the LLM models. This also helps to keep your dataset private.
:::

```js
const systemPrompt = `You can help users to create a map from a dataset.
Please always confirm the function calling and its arguments with the user.

Here is the dataset are available for function calling:
DatasetName: myVenues
Fields: location, longitude, latitude, revenue, population`;
```

You can use the `vegaLitePlot` tool to create a Vega-Lite plot from a dataset.

```typescript
import { vegaLitePlot, VegaLitePlotTool } from '@openassistant/plots';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const vegaLitePlotTool: VegaLitePlotTool = {
  ...vegaLitePlot,
  context: {
    getValues: async (datasetName, variableName) => {
      // get the values of the variable from dataset, e.g.
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
  onToolCompleted: (toolCallId, additionalData) => {
    console.log('Tool call completed:', toolCallId, additionalData);
    // you can import { VegaPlotComponent } from '@openassistant/vegalite';
    // render the Vega plot using <VegaPlotComponent props={additionalData} />
  },
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  system: systemPrompt,
  prompt:
    'Can you create a bar chart of the population for each location in dataset myVenues?',
  tools: {
    vegaLitePlot: convertToVercelAiTool(vegaLitePlotTool),
  },
});
```

## Interactive Plots Example

Here is an example of using AiAssistant to create eCharts plots that can be interactive with other components e.g. map, table, etc.

Install the dependencies:

```bash
npm install @openassistant/plots @openassistant/ui @openassistant/echarts
```

Then, you can use the `AiAssistant` component to create the plots.

```tsx
import {
  histogram,
  HistogramTool,
  scatterplot,
  ScatterplotTool,
} from '@openassistant/plots';
import {
  HistogramComponent,
  ScatterplotComponent,
} from '@openassistant/echarts';
import { AiAssistant } from '@openassistant/ui';

const histogramTool: HistogramTool = {
  ...histogram,
  context: {
    getValues: (datasetName, variableName) => {
      return SAMPLE_DATASETS[datasetName][variableName];
    },
    onSelected: (datasetName, selectedIndices) => {
      // you can use the selected indices to sync the selection in other components e.g. table, map, etc.
      console.log('Selected indices:', selectedIndices);
    },
  },
  component: HistogramComponent,
};

const scatterplotTool: ScatterplotTool = {
  ...scatterplot,
  context: {
    getValues: (datasetName, variableName) => {
      return SAMPLE_DATASETS[datasetName][variableName];
    },
    onSelected: (datasetName, selectedIndices) => {
      // you can use the selected indices to sync the selection in other components e.g. table, map, etc.
      console.log('Selected indices:', selectedIndices);
    },
  },
  component: ScatterplotComponent,
};

// use the tool in the chat component
<AiAssistant
  modelProvider="openai"
  model="gpt-4o"
  apiKey={process.env.OPENAI_API_KEY || ''}
  welcomeMessage="Hello! How can I help you today?"
  system={systemPrompt}
  functions={{ histogram: histogramTool, scatterplot: scatterplotTool }}
/>;
```

Once set up, you can create histograms through natural language prompts:

- For histograms: "Create a histogram of the 'revenue' variable"
- For scatter plots: "Show me a scatter plot of revenue vs population"

The assistant will automatically understand your request and use the appropriate visualization function.

See the [example](https://github.com/geodaopenjs/openassistant/tree/main/examples/echarts_plugin) for more details.

### With TailwindCSS

If you are using TailwindCSS, make sure to include the package's CSS in your project:

```typescript
import { heroui } from '@hero-ui/react';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/@openassistant/echarts/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [heroui()],
};
```
