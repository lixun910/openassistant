# Function: isAssistantMessageWithCompletedToolCalls()

> **isAssistantMessageWithCompletedToolCalls**(`message`): `boolean`

Defined in: [packages/core/src/llm/vercelai.ts:42](https://github.com/GeoDaCenter/openassistant/blob/bc4037be52d89829440fcc4aaa1010be73719d16/packages/core/src/llm/vercelai.ts#L42)

Check if the message is an assistant message with completed tool calls.
The message must have at least one tool invocation and all tool invocations
must have a result.

## Parameters

### message

`CoreMessage`

## Returns

`boolean`
