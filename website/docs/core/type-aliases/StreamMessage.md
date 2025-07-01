# Type Alias: StreamMessage

> **StreamMessage**: `object`

Defined in: [packages/core/src/types.ts:124](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/core/src/types.ts#L124)

Type of StreamMessage. The structure of the stream message is:

## Type declaration

### parts?

> `optional` **parts**: [`StreamMessagePart`](StreamMessagePart.md)[]

The parts of the message. It is used for storing the returning result from LLM.

## Param

The parts of the message. This is the text that happens after the tool calls.
