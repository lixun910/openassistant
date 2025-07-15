# Class: ToolCache

Defined in: [tool-cache.ts:42](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool-cache.ts#L42)

A singleton class to cache the results of tools.

## Accessors

### toolCache

#### Get Signature

> **get** **toolCache**(): `Record`\<`string`, `unknown`\>

Defined in: [tool-cache.ts:55](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool-cache.ts#L55)

##### Returns

`Record`\<`string`, `unknown`\>

## Methods

### addDataset()

> **addDataset**(`toolCallId`, `additionalData`): `void`

Defined in: [tool-cache.ts:59](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool-cache.ts#L59)

#### Parameters

##### toolCallId

`string`

##### additionalData

`unknown`

#### Returns

`void`

***

### clearCache()

> **clearCache**(): `void`

Defined in: [tool-cache.ts:79](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool-cache.ts#L79)

#### Returns

`void`

***

### getDataset()

> **getDataset**(`datasetName`): `null` \| [`ToolCacheDataset`](../type-aliases/ToolCacheDataset.md)

Defined in: [tool-cache.ts:93](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool-cache.ts#L93)

#### Parameters

##### datasetName

`string`

#### Returns

`null` \| [`ToolCacheDataset`](../type-aliases/ToolCacheDataset.md)

***

### hasDataset()

> **hasDataset**(`datasetName`): `boolean`

Defined in: [tool-cache.ts:89](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool-cache.ts#L89)

#### Parameters

##### datasetName

`string`

#### Returns

`boolean`

***

### removeDataset()

> **removeDataset**(`datasetName`): `void`

Defined in: [tool-cache.ts:83](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool-cache.ts#L83)

#### Parameters

##### datasetName

`string`

#### Returns

`void`

***

### getInstance()

> `static` **getInstance**(): [`ToolCache`](ToolCache.md)

Defined in: [tool-cache.ts:48](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool-cache.ts#L48)

#### Returns

[`ToolCache`](ToolCache.md)
