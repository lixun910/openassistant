# Type Alias: StreamMessage

> **StreamMessage**: `object`

Defined in: [packages/core/src/types.ts:124](https://github.com/GeoDaCenter/openassistant/blob/0f7bf760e453a1735df9463dc799b04ee2f630fd/packages/core/src/types.ts#L124)

Type of StreamMessage. The structure of the stream message is:

## Type declaration

### parts?

> `optional` **parts**: [`StreamMessagePart`](StreamMessagePart.md)[]

The parts of the message. It is used for storing the returning result from LLM.

## Param

The parts of the message. This is the text that happens after the tool calls.
