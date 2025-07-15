# Interface: ToolResult

Defined in: [vercel-tool.ts:23](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/vercel-tool.ts#L23)

## Properties

### description

> **description**: `string`

Defined in: [vercel-tool.ts:24](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/vercel-tool.ts#L24)

***

### execute()?

> `optional` **execute**: (`args`, `options`) => `Promise`\<`unknown`\>

Defined in: [vercel-tool.ts:26](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/vercel-tool.ts#L26)

#### Parameters

##### args

`Record`\<`string`, `unknown`\>

##### options

[`ToolExecutionOptions`](../type-aliases/ToolExecutionOptions.md)

#### Returns

`Promise`\<`unknown`\>

***

### parameters

> **parameters**: `Record`\<`string`, `unknown`\>

Defined in: [vercel-tool.ts:25](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/utils/src/vercel-tool.ts#L25)
