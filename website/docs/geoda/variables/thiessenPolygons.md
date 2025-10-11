# Variable: thiessenPolygons

> `const` **thiessenPolygons**: `ExtendedTool`\<[`ThiessenPolygonsArgs`](../type-aliases/ThiessenPolygonsArgs.md), [`ThiessenPolygonsLlmResult`](../type-aliases/ThiessenPolygonsLlmResult.md), [`ThiessenPolygonsAdditionalData`](../type-aliases/ThiessenPolygonsAdditionalData.md), [`SpatialToolContext`](../type-aliases/SpatialToolContext.md)\>

Defined in: [packages/tools/geoda/src/spatial\_ops/thiessenPolygons.ts:48](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/geoda/src/spatial_ops/thiessenPolygons.ts#L48)

## thiessenPolygons Tool

This tool generates thiessen polygons or voronoi diagrams from a given dataset or geojson.

### Thiessen Polygons Generation

It supports both direct geojson input and dataset names.

Example user prompts:
- "Generate thiessen polygons for this dataset"

## Example Code

```typescript
import { thiessenPolygons, ThiessenPolygonsTool } from '@openassistant/geoda';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const thiessenPolygonsTool: ThiessenPolygonsTool = {
  ...thiessenPolygons,
  context: {
    getGeometries: (datasetName) => {
      return getGeometries(datasetName);
    },
  },
  onToolCompleted: (toolCallId, additionalData) => {
    console.log(toolCallId, additionalData);
    // do something like save the thiessen polygons result in additionalData
  },
};

generateText({
  model: openai('gpt-4.1', { apiKey: key }),
  prompt: 'Generate thiessen polygons for this dataset',
  tools: { thiessenPolygons: convertToVercelAiTool(thiessenPolygonsTool) },
});
```
