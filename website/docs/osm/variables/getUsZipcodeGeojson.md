# Variable: getUsZipcodeGeojson

> `const` **getUsZipcodeGeojson**: `ExtendedTool`\<[`GetUsZipcodeGeojsonFunctionArgs`](../type-aliases/GetUsZipcodeGeojsonFunctionArgs.md), [`GetUsZipcodeGeojsonLlmResult`](../type-aliases/GetUsZipcodeGeojsonLlmResult.md), [`GetUsZipcodeGeojsonAdditionalData`](../type-aliases/GetUsZipcodeGeojsonAdditionalData.md), `never`\>

Defined in: [us/zipcode.ts:53](https://github.com/GeoDaCenter/openassistant/blob/2cb8f20a901f3385efeb40778248119c5e49db78/packages/osm/src/us/zipcode.ts#L53)

Get US Zipcode GeoJSON Tool

This tool retrieves the GeoJSON data for all zipcodes in a US state by its state code.
It returns the zipcodes' boundary geometries and properties.

Example user prompts:
- "Get all zipcodes in California"
- "Show me the zipcode boundaries of New York state"
- "What are the zipcodes in Texas?"

Example code:
```typescript
import { getUsZipcodeGeojson, GetUsZipcodeGeojsonTool } from "@openassistant/osm";

const zipcodeTool: GetUsZipcodeGeojsonTool = {
  ...getUsZipcodeGeojson,
  context: {}
};
```
