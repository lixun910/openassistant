# Variable: cartogram

> `const` **cartogram**: `ExtendedTool`\<[`CartogramFunctionArgs`](../type-aliases/CartogramFunctionArgs.md), [`CartogramLlmResult`](../type-aliases/CartogramLlmResult.md), [`CartogramAdditionalData`](../type-aliases/CartogramAdditionalData.md), [`SpatialToolContext`](../type-aliases/SpatialToolContext.md)\>

Defined in: [packages/tools/geoda/src/spatial\_ops/cartogram.ts:44](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/geoda/src/spatial_ops/cartogram.ts#L44)

## cartogram Tool

This tool is used to create a dorling cartogram from a given geometries and a variable.

### Cartogram Creation

A cartogram is a map type where the original layout of the areal unit is replaced by a geometric form (usually a circle, rectangle, or hexagon) that is proportional to the value of the variable for the location. This is in contrast to a standard choropleth map, where the size of the polygon corresponds to the area of the location in question. The cartogram has a long history and many variants have been suggested, some quite creative. In essence, the construction of a cartogram is an example of a nonlinear optimization problem, where the geometric forms have to be located such that they reflect the topology (spatial arrangement) of the locations as closely as possible (see Tobler 2004, for an extensive discussion of various aspects of the cartogram).

<img width="1152" src="https://github.com/user-attachments/assets/eef1834e-e4c0-4ab1-84b1-50a8937b1a86" />

## Example
```ts
import { cartogram, CartogramTool } from '@openassistant/geoda';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const cartogramTool: CartogramTool = {
  ...cartogram,
  context: {
    getGeometries: (datasetName) => {
      return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
    },
    getValues: (datasetName, variableName) => {
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
});

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Create a dorling cartogram from the geometries and the variable "population"',
  tools: { cartogram: convertToVercelAiTool(cartogramTool) },
});
```
