# Type Alias: ExtendedTool\<PARAMETERS, RETURN_TYPE, ADDITIONAL_DATA, CONTEXT\>

> **ExtendedTool**\<`PARAMETERS`, `RETURN_TYPE`, `ADDITIONAL_DATA`, `CONTEXT`\>: `object`

Defined in: [tool.ts:40](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool.ts#L40)

## Type Parameters

• **PARAMETERS** *extends* [`Parameters`](Parameters.md) = `never`

• **RETURN_TYPE** = `never`

• **ADDITIONAL_DATA** = `never`

• **CONTEXT** = `unknown`

## Type declaration

### component?

> `optional` **component**: `React.ElementType`

### context?

> `optional` **context**: `CONTEXT`

### description

> **description**: `string`

### execute

> **execute**: [`ExecuteFunction`](ExecuteFunction.md)\<`PARAMETERS`, `RETURN_TYPE`, `ADDITIONAL_DATA`, `CONTEXT`\>

### onToolCompleted?

> `optional` **onToolCompleted**: [`OnToolCompleted`](OnToolCompleted.md)

### parameters

> **parameters**: `PARAMETERS`
