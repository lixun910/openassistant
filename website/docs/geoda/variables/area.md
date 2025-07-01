# Variable: area

> `const` **area**: `ExtendedTool`\<[`AreaFunctionArgs`](../type-aliases/AreaFunctionArgs.md), [`AreaLlmResult`](../type-aliases/AreaLlmResult.md), [`AreaAdditionalData`](../type-aliases/AreaAdditionalData.md), [`SpatialToolContext`](../type-aliases/SpatialToolContext.md)\>

Defined in: [packages/tools/geoda/src/spatial\_ops/area.ts:69](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/geoda/src/spatial_ops/area.ts#L69)

## area Tool

This tool calculates the area of geometries in a GeoJSON dataset.

### Area Calculation

It supports both direct GeoJSON input and dataset names, and can calculate
areas in either square kilometers or square miles.

Example user prompts:
- "Calculate the area of these counties in square kilometers"
- "What is the total area of these land parcels in square miles?"
- "Measure the area of these polygons"

Example code:
```typescript
import { area } from '@openassistant/geoda';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const toolContext = {
  getGeometries: (datasetName) => {
    return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
  },
};
const areaTool: AreaTool = {
  ...area,
  context: toolContext,
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Calculate the area of these counties in square kilometers',
  tools: {area: convertToVercelAiTool(area)},
});
```

You can also use this tool with other tools, e.g. geocoding, so you don't need to provide the `getGeometries` function.
The geometries from geocoding tool will be used as the input for this tool.
```
