# Type Alias: SendTextMessageProps

> **SendTextMessageProps**: `object`

Defined in: [packages/core/src/hooks/use-assistant.ts:89](https://github.com/GeoDaCenter/openassistant/blob/2cb8f20a901f3385efeb40778248119c5e49db78/packages/core/src/hooks/use-assistant.ts#L89)

Parameters for sending a text message to the assistant.

## Type declaration

### message

> **message**: `string`

### onStepFinish()?

> `optional` **onStepFinish**: (`event`, `toolCallMessages`) => `Promise`\<`void`\> \| `void`

#### Parameters

##### event

`StepResult`\<`ToolSet`\>

##### toolCallMessages

[`ToolCallMessage`](ToolCallMessage.md)[]

#### Returns

`Promise`\<`void`\> \| `void`

### streamMessageCallback

> **streamMessageCallback**: [`StreamMessageCallback`](StreamMessageCallback.md)

## Param

The text message to send to the assistant.

## Param

Callback function to handle streaming response chunks.

## Param

Optional callback triggered when a conversation step completes.
