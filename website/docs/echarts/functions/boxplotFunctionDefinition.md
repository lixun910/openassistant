# Function: boxplotFunctionDefinition()

> **boxplotFunctionDefinition**(`context`, `callbackMessage`): `RegisterFunctionCallingProps`

Defined in: [packages/echarts/src/boxplot/definition.ts:98](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/echarts/src/boxplot/definition.ts#L98)

Define the boxplot function for tool calling. This function can assist user to create a boxplot using the values of a variable in the dataset.
The values should be retrieved using the getValues() callback function.

User can select data points in the boxplot, and the selections can be synced back to the original dataset using the onSelected() callback.
See [OnSelectedCallback](../type-aliases/OnSelectedCallback.md) for more details.

## Parameters

### context

`CustomFunctionContext`\<`BoxplotFunctionContextValues`\>

The context of the function. See [BoxplotFunctionContext](../type-aliases/BoxplotFunctionContext.md) for more details.

### callbackMessage

(`props`) => `ReactNode`

## Returns

`RegisterFunctionCallingProps`

The function definition.
