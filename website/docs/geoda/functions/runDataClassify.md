# Function: runDataClassify()

> **runDataClassify**(`__namedParameters`): `Promise`\<\{ `additionalData`: `any`; `llmResult`: \{ `error`: `undefined`; `result`: `any`; `success`: `boolean`; \}; \} \| \{ `additionalData`: `undefined`; `llmResult`: \{ `error`: `string`; `result`: `undefined`; `success`: `boolean`; \}; \}\>

Defined in: [packages/tools/geoda/src/data-classify/tool.ts:214](https://github.com/GeoDaCenter/openassistant/blob/bc4037be52d89829440fcc4aaa1010be73719d16/packages/tools/geoda/src/data-classify/tool.ts#L214)

## Parameters

### \_\_namedParameters

#### datasetName

`string`

#### getValues

[`GetValues`](../type-aliases/GetValues.md)

#### hinge?

`number` = `1.5`

#### k

`number`

#### method

`string`

#### variableName

`string`

## Returns

`Promise`\<\{ `additionalData`: `any`; `llmResult`: \{ `error`: `undefined`; `result`: `any`; `success`: `boolean`; \}; \} \| \{ `additionalData`: `undefined`; `llmResult`: \{ `error`: `string`; `result`: `undefined`; `success`: `boolean`; \}; \}\>
