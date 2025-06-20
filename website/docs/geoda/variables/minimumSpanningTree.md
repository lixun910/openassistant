# Variable: minimumSpanningTree

> `const` **minimumSpanningTree**: `ExtendedTool`\<[`MinimumSpanningTreeArgs`](../type-aliases/MinimumSpanningTreeArgs.md), [`MinimumSpanningTreeLlmResult`](../type-aliases/MinimumSpanningTreeLlmResult.md), [`MinimumSpanningTreeAdditionalData`](../type-aliases/MinimumSpanningTreeAdditionalData.md), [`SpatialToolContext`](../type-aliases/SpatialToolContext.md)\>

Defined in: [packages/tools/geoda/src/spatial\_ops/mst.ts:47](https://github.com/GeoDaCenter/openassistant/blob/37d127dc7a76d6b5cf9de906c055e4c904e3dfed/packages/tools/geoda/src/spatial_ops/mst.ts#L47)

Minimum Spanning Tree Tool

This tool generates the minimum spanning tree from a given dataset or geojson.
It supports both direct geojson input and dataset names.

:::note
For polygons, the centroids are used to generate the minimum spanning tree.
:::

<img width="1040" src="https://github.com/user-attachments/assets/acdde378-05d2-4fce-9eba-c9e6eb3db662" />

Example user prompts:
- "Generate the minimum spanning tree for this dataset"

## Example Code

```typescript
import { minimumSpanningTree, MinimumSpanningTreeTool } from '@openassistant/geoda';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const mstTool: MstTool = {
  ...mst,
  context: {
    getGeometries: (datasetName) => {
      return getGeometries(datasetName);
    },
  },
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Generate the minimum spanning tree for this dataset',
  tools: { mst: convertToVercelAiTool(mstTool) },
});
```
