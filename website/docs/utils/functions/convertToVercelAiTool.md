# Function: convertToVercelAiTool()

> **convertToVercelAiTool**\<`PARAMETERS`, `RETURN_TYPE`, `ADDITIONAL_DATA`, `CONTEXT`\>(`extendedTool`, `isExecutable`): `object`

Defined in: [vercel-tool.ts:96](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/vercel-tool.ts#L96)

Convert an extended tool to a Vercel AI tool.

## Example
```ts
import { convertToVercelAiTool } from '@openassistant/utils';
import { localQuery, LocalQueryTool } from '@openassistant/duckdb';

const localQueryTool: LocalQueryTool = {
  ...localQuery,
  context: {
    getValues: (datasetName, variableName) => {
      return [1, 2, 3];
    },
  },
};

const tool = localQuery({
  model: openai('gpt-4o-mini', { apiKey: key }),
  prompt: 'Get the values of the variable "income" for the dataset "census"',
  tools: { localQuery: convertToVercelAiTool(localQueryTool) },
});
```

## Type Parameters

• **PARAMETERS** *extends* `ZodTypeAny` = `never`

• **RETURN_TYPE** = `never`

• **ADDITIONAL_DATA** = `never`

• **CONTEXT** = `unknown`

## Parameters

### extendedTool

[`ExtendedTool`](../type-aliases/ExtendedTool.md)\<`PARAMETERS`, `RETURN_TYPE`, `ADDITIONAL_DATA`, `CONTEXT`\>

The extended tool to convert.

### isExecutable

Whether the tool is executable.

#### isExecutable?

`boolean` = `true`

## Returns

`object`

The Vercel AI tool.

### description

> **description**: `string` = `extendedTool.description`

### execute()?

> `optional` **execute**: (`args`, `options`) => `Promise`\<`RETURN_TYPE` *extends* `never` ? `RETURN_TYPE`\<`RETURN_TYPE`\> : `object`\>

#### Parameters

##### args

`Record`\<`string`, `unknown`\>

##### options

[`ToolExecutionOptions`](../type-aliases/ToolExecutionOptions.md)

#### Returns

`Promise`\<`RETURN_TYPE` *extends* `never` ? `RETURN_TYPE`\<`RETURN_TYPE`\> : `object`\>

### parameters

> **parameters**: `PARAMETERS` = `extendedTool.parameters`
