# Type Alias: SendTextMessageProps

> **SendTextMessageProps**: `object`

Defined in: [packages/core/src/hooks/use-assistant.ts:78](https://github.com/GeoDaCenter/openassistant/blob/0f7bf760e453a1735df9463dc799b04ee2f630fd/packages/core/src/hooks/use-assistant.ts#L78)

Parameters for sending a text message to the assistant.

## Type declaration

### message

> **message**: `string`

### onToolFinished()?

> `optional` **onToolFinished**: (`toolCallId`, `additionalData`) => `void`

#### Parameters

##### toolCallId

`string`

##### additionalData

`unknown`

#### Returns

`void`

### streamMessageCallback

> **streamMessageCallback**: [`StreamMessageCallback`](StreamMessageCallback.md)

## Param

The text message to send to the assistant.

## Param

Callback function to handle streaming response chunks.

## Param

Optional callback triggered when a tool call completes.
