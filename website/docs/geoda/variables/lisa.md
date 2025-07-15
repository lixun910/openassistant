# Variable: lisa

> `const` **lisa**: `ExtendedTool`\<[`LisaFunctionArgs`](../type-aliases/LisaFunctionArgs.md), [`LisaLlmResult`](../type-aliases/LisaLlmResult.md), [`LisaAdditionalData`](../type-aliases/LisaAdditionalData.md), [`LisaFunctionContext`](../type-aliases/LisaFunctionContext.md)\>

Defined in: [packages/tools/geoda/src/lisa/tool.ts:109](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/geoda/src/lisa/tool.ts#L109)

## lisa Tool

This tool is used to apply local indicators of spatial association (LISA) statistics
to identify local clusters and spatial outliers.

### LISA Methods

The LISA method can be one of the following types: localMoran, localGeary, localG, localGStar, quantileLisa.

**Example user prompts:**
- "Are young population clustering over the zipcode areas?"
- "Can you perform a local Moran's I analysis on the population data?"
- "What are the local clusters in the population data?"
- "How many significant clusters are there in the population data?"

:::note
The LISA tool should always be used with the spatialWeights tool. The LLM models know how to use the spatialWeights tool for the LISA analysis.
:::

## Example

```typescript
import { spatialWeights, SpatialWeightsTool, lisa, LisaTool } from "@openassistant/geoda";

const spatialWeightsTool: SpatialWeightsTool = {
  ...spatialWeights,
  context: {
    getGeometries: (datasetName) => {
      return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
    },
  },
};

const lisaTool: LisaTool = {
  ...lisa,
  context: {
    getValues: (datasetName, variableName) => {
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
});

const result = await generateText({
  model: openai('gpt-4o'),
  prompt: 'Can you perform a local Moran analysis on the population data?',
  tools: {
    lisa: convertToVercelAiTool(lisaTool),
    spatialWeights: convertToVercelAiTool(spatialWeightsTool),
  },
});
```
