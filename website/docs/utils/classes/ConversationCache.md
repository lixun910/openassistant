# Class: ConversationCache

Defined in: [conversation-cache.ts:43](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/conversation-cache.ts#L43)

ConversationCache manages ToolOutputManager instances per conversation,
providing persistent caching across requests within the same conversation
while maintaining isolation between different conversations.

## Constructors

### new ConversationCache()

> **new ConversationCache**(`config`): [`ConversationCache`](ConversationCache.md)

Defined in: [conversation-cache.ts:48](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/conversation-cache.ts#L48)

#### Parameters

##### config

[`ConversationCacheConfig`](../interfaces/ConversationCacheConfig.md) = `{}`

#### Returns

[`ConversationCache`](ConversationCache.md)

## Methods

### clearAll()

> **clearAll**(): `void`

Defined in: [conversation-cache.ts:184](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/conversation-cache.ts#L184)

Manually clear all conversations from the cache.

#### Returns

`void`

***

### getConfig()

> **getConfig**(): `Required`\<[`ConversationCacheConfig`](../interfaces/ConversationCacheConfig.md)\>

Defined in: [conversation-cache.ts:195](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/conversation-cache.ts#L195)

Get the current configuration.

#### Returns

`Required`\<[`ConversationCacheConfig`](../interfaces/ConversationCacheConfig.md)\>

***

### getStatus()

> **getStatus**(): `Promise`\<[`ConversationCacheStatus`](../interfaces/ConversationCacheStatus.md)\>

Defined in: [conversation-cache.ts:152](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/conversation-cache.ts#L152)

Get status information about the conversation cache.

#### Returns

`Promise`\<[`ConversationCacheStatus`](../interfaces/ConversationCacheStatus.md)\>

***

### getToolOutputManager()

> **getToolOutputManager**(`conversationId`): `Promise`\<[`ToolOutputManager`](ToolOutputManager.md)\>

Defined in: [conversation-cache.ts:73](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/conversation-cache.ts#L73)

Get or create a ToolOutputManager for the given conversation ID.

#### Parameters

##### conversationId

`string`

#### Returns

`Promise`\<[`ToolOutputManager`](ToolOutputManager.md)\>
