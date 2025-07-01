# Interface: ConversationCacheConfig

Defined in: [conversation-cache.ts:3](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/conversation-cache.ts#L3)

## Properties

### cleanupProbability?

> `optional` **cleanupProbability**: `number`

Defined in: [conversation-cache.ts:9](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/conversation-cache.ts#L9)

Probability of triggering cleanup on each access (default: 0.1 = 10%)

***

### enableLogging?

> `optional` **enableLogging**: `boolean`

Defined in: [conversation-cache.ts:11](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/conversation-cache.ts#L11)

Whether to enable debug logging (default: false)

***

### maxConversations?

> `optional` **maxConversations**: `number`

Defined in: [conversation-cache.ts:5](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/conversation-cache.ts#L5)

Maximum number of conversations to keep in memory (default: 100)

***

### ttlMs?

> `optional` **ttlMs**: `number`

Defined in: [conversation-cache.ts:7](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/conversation-cache.ts#L7)

Time-to-live for conversations in milliseconds (default: 2 hours)
