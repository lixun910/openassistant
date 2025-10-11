# Variable: vegaLitePlot

> `const` **vegaLitePlot**: `ExtendedTool`\<[`VegaLitePlotToolArgs`](../type-aliases/VegaLitePlotToolArgs.md), [`VegaLitePlotLlmResult`](../type-aliases/VegaLitePlotLlmResult.md), [`VegaLitePlotAdditionalData`](../type-aliases/VegaLitePlotAdditionalData.md), [`EChartsToolContext`](../type-aliases/EChartsToolContext.md)\>

Defined in: [packages/tools/plots/src/vegalite/tool.ts:72](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/plots/src/vegalite/tool.ts#L72)

vegaLitePlot Tool

This tool is used to create a Vega plot from a dataset and variables.

There are many different plot types in Vega-Lite, you can find the full list of plot types [here](https://vega.github.io/vega-lite/examples/).

**Example user prompts:**
- "Can you create a bar chart of the population for each location in dataset myVenues?"
- "Can you show a bar chart of the population for each location in dataset myVenues?"

:::note
This tool is a browser-side tool.
:::

## Example

```ts
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
  model: openai('gpt-4.1', { apiKey: key }),
  prompt: 'Can you create a bar chart of the population for each location in dataset myVenues?',
  tools: {
    vegaLitePlot: convertToVercelAiTool(vegaLitePlotTool),
  },
});
```
