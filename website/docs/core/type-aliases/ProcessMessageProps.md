# Type Alias: ProcessMessageProps

> **ProcessMessageProps**: `object`

Defined in: [packages/core/src/types.ts:206](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/core/src/types.ts#L206)

Type of ProcessMessageProps

## Type declaration

### imageMessage?

> `optional` **imageMessage**: `string`

### message?

> `optional` **message**: `string`

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

### textMessage?

> `optional` **textMessage**: `string`

### userActions?

> `optional` **userActions**: [`UserActionProps`](UserActionProps.md)[]

### useTool?

> `optional` **useTool**: `boolean`

## Param

The text message to be processed.

## Param

The image message to be processed.

## Param

The user actions to be processed.

## Param

The stream message callback to stream the message back to the UI.

## Param

The callback function to handle the step finish.

## Param

The flag to indicate if the tool is used.

## Param

The message to be processed.
