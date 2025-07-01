# Type Alias: ExecuteFunctionResult\<RETURN_TYPE, ADDITIONAL_DATA\>

> **ExecuteFunctionResult**\<`RETURN_TYPE`, `ADDITIONAL_DATA`\>: `object`

Defined in: [tool.ts:20](https://github.com/GeoDaCenter/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/tool.ts#L20)

## Type Parameters

• **RETURN_TYPE** = `never`

• **ADDITIONAL_DATA** = `never`

## Type declaration

### additionalData?

> `optional` **additionalData**: `ADDITIONAL_DATA` *extends* `never` ? `ADDITIONAL_DATA` : `object`

### llmResult

> **llmResult**: `RETURN_TYPE` *extends* `never` ? `RETURN_TYPE` : `object`
