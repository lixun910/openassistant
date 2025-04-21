# Type Alias: ExtendedTool\<PARAMETERS, RETURN_TYPE, ADDITIONAL_DATA, CONTEXT\>

> **ExtendedTool**\<`PARAMETERS`, `RETURN_TYPE`, `ADDITIONAL_DATA`, `CONTEXT`\>: `Tool`\<`PARAMETERS`\> & `object`

Defined in: [packages/core/src/utils/create-assistant.ts:87](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/core/src/utils/create-assistant.ts#L87)

A tool contains the description and the schema of the input that the tool expects.
This enables the language model to generate the input.
ExtendedTool extends the Tool type from Vercel AI SDK: https://sdk.vercel.ai/docs/reference/ai-sdk-core/tool#tool.tool

The tool can also contain:
- an optional execute function for the actual execution function of the tool.
- an optional context for providing additional data for the tool execution.
- an optional component for rendering additional information (e.g. chart or map) of LLM response.

## Type declaration

### component?

> `optional` **component**: `React.ElementType`

The component that will be rendered with the results of execute() when the tool is executed

### context?

> `optional` **context**: `CONTEXT`

The context that will be passed to the function

### execute

> **execute**: `ExecuteFunction`\<`PARAMETERS`, `RETURN_TYPE`, `ADDITIONAL_DATA`, `CONTEXT`\>

The function that will be called when the tool is executed

## Type Parameters

• **PARAMETERS** *extends* `Parameters` = `never`

• **RETURN_TYPE** = `never`

• **ADDITIONAL_DATA** = `never`

• **CONTEXT** = [`CustomFunctionContext`](CustomFunctionContext.md)\<`unknown`\> \| [`CustomFunctionContextCallback`](CustomFunctionContextCallback.md)\<`unknown`\>
