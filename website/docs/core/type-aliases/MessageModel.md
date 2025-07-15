# Type Alias: MessageModel

> **MessageModel**: `object`

Defined in: [packages/core/src/types.ts:75](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/core/src/types.ts#L75)

Type of Message model used in the chat component

## Type declaration

### direction

> **direction**: [`MessageDirection`](MessageDirection.md)

The direction of the message

### messageContent?

> `optional` **messageContent**: [`StreamMessage`](StreamMessage.md)

The content of the message

### payload?

> `optional` **payload**: [`MessagePayload`](MessagePayload.md)

The payload of the message

### position

> **position**: `"single"` \| `"first"` \| `"normal"` \| `"last"` \| `0` \| `1` \| `2` \| `3`

The position of the message

### sender?

> `optional` **sender**: `"user"` \| `"assistant"` \| `"error"`

The sender of the message

### sentTime?

> `optional` **sentTime**: `string`

The time the message was sent

### type?

> `optional` **type**: [`MessageType`](MessageType.md)

The type of the message
