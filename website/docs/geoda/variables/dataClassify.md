# Variable: dataClassify

> `const` **dataClassify**: `ExtendedTool`\<[`DataClassifyFunctionArgs`](../type-aliases/DataClassifyFunctionArgs.md), [`DataClassifyLlmResult`](../type-aliases/DataClassifyLlmResult.md), [`DataClassifyAdditionalData`](../type-aliases/DataClassifyAdditionalData.md), [`DataClassifyFunctionContext`](../type-aliases/DataClassifyFunctionContext.md)\>

Defined in: [packages/tools/geoda/src/data-classify/tool.ts:102](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/geoda/src/data-classify/tool.ts#L102)

## dataClassify Tool

This tool is used to classify the data into k bins or classes.

### Classification Methods

The classification method can be one of the following types:
- quantile
- natural breaks
- equal interval
- percentile
- box
- standard deviation
- unique values.

**Example user prompts:**
- "Can you classify the data of population into 5 classes?"

## Example

```typescript
import { dataClassify, DataClassifyTool } from "@openassistant/geoda";
import { convertToVercelAiTool } from "@openassistant/utils";

const classifyTool: DataClassifyTool = {
  ...dataClassify,
  toolContext: {
    getValues: async (datasetName: string, variableName: string) => {
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
};

const result = await generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Can you classify the data of population into 5 classes?',
  tools: {dataClassify: convertToVercelAiTool(classifyTool)},
});

```

For a more complete example, see the [Geoda Tools Example using Next.js + Vercel AI SDK](https://github.com/openassistant/openassistant/tree/main/examples/vercel_geoda_example).
