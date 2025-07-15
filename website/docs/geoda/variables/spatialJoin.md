# Variable: spatialJoin

> `const` **spatialJoin**: `ExtendedTool`\<[`SpatialJoinFunctionArgs`](../type-aliases/SpatialJoinFunctionArgs.md), [`SpatialJoinLlmResult`](../type-aliases/SpatialJoinLlmResult.md), [`SpatialJoinAdditionalData`](../type-aliases/SpatialJoinAdditionalData.md), [`SpatialJoinFunctionContext`](../type-aliases/SpatialJoinFunctionContext.md)\>

Defined in: [packages/tools/geoda/src/spatial\_join/tool.ts:117](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/geoda/src/spatial_join/tool.ts#L117)

## spatialJoin Tool

This tool is used to join geometries from one dataset with geometries from another dataset.

### Spatial Join Operations

The tool supports various join operations:
- sum: sum of values in overlapping geometries
- mean: average of values in overlapping geometries
- min: minimum value in overlapping geometries
- max: maximum value in overlapping geometries
- median: median value in overlapping geometries
- count: count of overlapping geometries

When user prompts e.g. *can you join the population data with county boundaries?*

1. The LLM will execute the callback function of spatialJoinFunctionDefinition, and perform the spatial join using the geometries retrieved from `getGeometries` function.
2. The result will include joined values and a new dataset with the joined geometries.
3. The LLM will respond with the join results and details about the new dataset.

### For example
```
User: can you join the population data with county boundaries?
LLM: I've performed a spatial join between the population data and county boundaries. The result shows the total population in each county...
```

### Code example
```typescript
import { spatialJoin, SpatialJoinTool } from '@openassistant/geoda';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const spatialJoinTool: SpatialJoinTool = {
  ...spatialJoin,
  context: {
    getGeometries: (datasetName) => {
      return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
    },
    getValues: (datasetName, variableName) => {
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
  onToolCompleted: (toolCallId, additionalData) => {
    console.log(toolCallId, additionalData);
    // do something like save the join result in additionalData
  },
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you join the population data with county boundaries?',
  tools: {spatialJoin: convertToVercelAiTool(spatialJoinTool)},
});
```
