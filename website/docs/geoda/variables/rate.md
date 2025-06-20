# Variable: rate

> `const` **rate**: `ExtendedTool`\<[`RateFunctionArgs`](../type-aliases/RateFunctionArgs.md), [`RateLlmResult`](../type-aliases/RateLlmResult.md), [`RateAdditionalData`](../type-aliases/RateAdditionalData.md), [`RateContext`](../type-aliases/RateContext.md)\>

Defined in: packages/tools/geoda/src/rate/tool.ts:39

Calculate the rates from a base variable and an event variable using one of the following methods:
- Raw Rates
- Excess Risk
- Empirical Bayes
- Spatial Rates
- Spatial Empirical Bayes
- EB Rate Standardization

## Example
```ts
import { rate, RateTool } from '@openassistant/geoda';
import { convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';

const rateTool: RateTool = {
  ...rate,
  context: {
    getValues: (datasetName, variableName) => {
      return getValues(datasetName, variableName);
    },
  },
};

generateText({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Calculate the excess risk rates from the base variable "population" and the event variable "crimes"',
  tools: { rate: convertToVercelAiTool(rateTool) },
});
```
