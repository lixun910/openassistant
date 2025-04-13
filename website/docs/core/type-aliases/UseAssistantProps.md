# Type Alias: UseAssistantProps

> **UseAssistantProps**: `object`

Defined in: [packages/core/src/hooks/use-assistant.ts:33](https://github.com/GeoDaCenter/openassistant/blob/ae6e39c15b60e7a98a21d90a5bbeff5dc44c1295/packages/core/src/hooks/use-assistant.ts#L33)

Props for configuring the AI Assistant and useAssistant hook.

## Type declaration

### abortController?

> `optional` **abortController**: `AbortController`

### apiKey

> **apiKey**: `string`

### baseUrl?

> `optional` **baseUrl**: `string`

### chatEndpoint?

> `optional` **chatEndpoint**: `string`

### description?

> `optional` **description**: `string`

### functions?

> `optional` **functions**: [`RegisterFunctionCallingProps`](RegisterFunctionCallingProps.md)[] \| `Record`\<`string`, [`ExtendedTool`](ExtendedTool.md)\<`any`\>\>

### historyMessages?

> `optional` **historyMessages**: `Message`[]

### instructions

> **instructions**: `string`

### maxSteps?

> `optional` **maxSteps**: `number`

### model

> **model**: `string`

### modelProvider

> **modelProvider**: `string`

### name

> **name**: `string`

### temperature?

> `optional` **temperature**: `number`

### toolCallStreaming?

> `optional` **toolCallStreaming**: `boolean`

### toolChoice?

> `optional` **toolChoice**: `ToolChoice`\<`ToolSet`\>

### topP?

> `optional` **topP**: `number`

### version?

> `optional` **version**: `string`

### voiceEndpoint?

> `optional` **voiceEndpoint**: `string`

## Param

The server endpoint for handling chat requests (e.g. '/api/chat'). Required for server-side support.

## Param

The server endpoint for handling voice/audio requests.

## Param

The display name of the assistant.

## Param

The AI model provider service (e.g. 'openai', 'anthropic').

## Param

The specific model identifier to use.

## Param

Authentication key for the model provider's API.

## Param

Optional API version to use.

## Param

Optional base URL for API requests.

## Param

Optional description of the assistant's purpose.

## Param

Controls randomness in responses (0-1).

## Param

Controls diversity of responses via nucleus sampling (0-1).

## Param

System instructions/prompt for the assistant.

## Param

Custom functions/tools the assistant can use, either as an array or record object.

## Param

Controls how the assistant selects tools to use.

## Param

Maximum number of steps/iterations in a conversation.

## Param

Optional AbortController to cancel requests.
