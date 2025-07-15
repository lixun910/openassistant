# Type Alias: ExecuteFunction()\<PARAMETERS, RETURN_TYPE, ADDITIONAL_DATA, CONTEXT\>

> **ExecuteFunction**\<`PARAMETERS`, `RETURN_TYPE`, `ADDITIONAL_DATA`, `CONTEXT`\>: (`args`, `options`?) => `PromiseLike`\<[`ExecuteFunctionResult`](ExecuteFunctionResult.md)\<`RETURN_TYPE`, `ADDITIONAL_DATA`\>\>

Defined in: [tool.ts:28](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool.ts#L28)

## Type Parameters

• **PARAMETERS** *extends* [`Parameters`](Parameters.md)

• **RETURN_TYPE** = `never`

• **ADDITIONAL_DATA** = `never`

• **CONTEXT** = `never`

## Parameters

### args

[`inferParameters`](inferParameters.md)\<`PARAMETERS`\>

### options?

[`ToolExecutionOptions`](ToolExecutionOptions.md) & `object`

## Returns

`PromiseLike`\<[`ExecuteFunctionResult`](ExecuteFunctionResult.md)\<`RETURN_TYPE`, `ADDITIONAL_DATA`\>\>
