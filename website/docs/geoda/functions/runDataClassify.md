# Function: runDataClassify()

> **runDataClassify**(`__namedParameters`): `Promise`\<\{ `additionalData`: `any`; `llmResult`: \{ `error`: `undefined`; `result`: `any`; `success`: `boolean`; \}; \} \| \{ `additionalData`: `undefined`; `llmResult`: \{ `error`: `string`; `result`: `undefined`; `success`: `boolean`; \}; \}\>

Defined in: [packages/tools/geoda/src/data-classify/tool.ts:211](https://github.com/GeoDaCenter/openassistant/blob/dc72d81a35cf8e46295657303846fbb4ad891993/packages/tools/geoda/src/data-classify/tool.ts#L211)

## Parameters

### \_\_namedParameters

#### datasetName

`string`

#### getValues

[`GetValues`](../type-aliases/GetValues.md)

#### hinge?

`number`

#### k

`number`

#### method

`string`

#### variableName

`string`

## Returns

`Promise`\<\{ `additionalData`: `any`; `llmResult`: \{ `error`: `undefined`; `result`: `any`; `success`: `boolean`; \}; \} \| \{ `additionalData`: `undefined`; `llmResult`: \{ `error`: `string`; `result`: `undefined`; `success`: `boolean`; \}; \}\>
