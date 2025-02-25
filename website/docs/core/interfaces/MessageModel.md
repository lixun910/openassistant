# Interface: MessageModel

Defined in: [types.ts:46](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/core/src/types.ts#L46)

Type of Message model

## Param

The message to be sent

## Param

The time the message was sent

## Param

The sender of the message

## Param

The direction of the message

## Param

The position of the message

## Param

The type of the message

## Param

The payload of the message, can be string, object, image or custom

## Properties

### direction

> **direction**: [`MessageDirection`](../type-aliases/MessageDirection.md)

Defined in: [types.ts:50](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/core/src/types.ts#L50)

***

### message?

> `optional` **message**: `string`

Defined in: [types.ts:47](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/core/src/types.ts#L47)

***

### payload?

> `optional` **payload**: [`MessagePayload`](../type-aliases/MessagePayload.md)

Defined in: [types.ts:53](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/core/src/types.ts#L53)

***

### position

> **position**: `0` \| `1` \| `"single"` \| `"first"` \| `"normal"` \| `"last"` \| `2` \| `3`

Defined in: [types.ts:51](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/core/src/types.ts#L51)

***

### sender?

> `optional` **sender**: `string`

Defined in: [types.ts:49](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/core/src/types.ts#L49)

***

### sentTime?

> `optional` **sentTime**: `string`

Defined in: [types.ts:48](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/core/src/types.ts#L48)

***

### type?

> `optional` **type**: [`MessageType`](../type-aliases/MessageType.md)

Defined in: [types.ts:52](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/core/src/types.ts#L52)
