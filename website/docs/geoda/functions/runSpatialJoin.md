# Function: runSpatialJoin()

> **runSpatialJoin**(`__namedParameters`): `Promise`\<\{ `additionalData`: \{ `[key: string]`: `undefined` \| `string` \| `number`[][] \| `object`[] \| `Record`\<`string`, (`string` \| `number`)[]\> \| \{ `content`: \{ `features`: `any`[]; `type`: `string`; \}; `type`: `string`; \} \| \{ `content`: `any`[][]; `type`: `string`; \};  `datasetName`: `string`; `joinResult`: `number`[][]; `joinValues`: `Record`\<`string`, (`string` \| `number`)[]\>; `joinVariables`: `undefined` \| `object`[]; `leftDatasetName`: `string`; `rightDatasetName`: `string`; \}; `llmResult`: \{ `datasetName`: `string`; `error`: `undefined`; `firstTwoRows`: `object`[]; `joinStats`: \{ `averageCount`: `number`; `maxCount`: `number`; `minCount`: `number`; `totalCount`: `number`; \}; `result`: `string`; `success`: `boolean`; \}; \} \| \{ `additionalData`: `undefined`; `llmResult`: \{ `datasetName`: `undefined`; `error`: `string`; `firstTwoRows`: `undefined`; `joinStats`: `undefined`; `result`: `undefined`; `success`: `boolean`; \}; \}\>

Defined in: [packages/tools/geoda/src/spatial\_join/tool.ts:220](https://github.com/GeoDaCenter/openassistant/blob/37d127dc7a76d6b5cf9de906c055e4c904e3dfed/packages/tools/geoda/src/spatial_join/tool.ts#L220)

## Parameters

### \_\_namedParameters

#### getGeometries

[`GetGeometries`](../type-aliases/GetGeometries.md)

#### getValues

[`GetValues`](../type-aliases/GetValues.md)

#### joinVariables?

`object`[]

#### leftDatasetName

`string`

#### previousExecutionOutput?

\{ `data`: \{ `geojson`: `FeatureCollection`\<`Geometry`, `GeoJsonProperties`\>; \}; \}

#### previousExecutionOutput.data?

\{ `geojson`: `FeatureCollection`\<`Geometry`, `GeoJsonProperties`\>; \}

#### previousExecutionOutput.data.geojson?

`FeatureCollection`\<`Geometry`, `GeoJsonProperties`\>

#### rightDatasetName

`string`

## Returns

`Promise`\<\{ `additionalData`: \{ `[key: string]`: `undefined` \| `string` \| `number`[][] \| `object`[] \| `Record`\<`string`, (`string` \| `number`)[]\> \| \{ `content`: \{ `features`: `any`[]; `type`: `string`; \}; `type`: `string`; \} \| \{ `content`: `any`[][]; `type`: `string`; \};  `datasetName`: `string`; `joinResult`: `number`[][]; `joinValues`: `Record`\<`string`, (`string` \| `number`)[]\>; `joinVariables`: `undefined` \| `object`[]; `leftDatasetName`: `string`; `rightDatasetName`: `string`; \}; `llmResult`: \{ `datasetName`: `string`; `error`: `undefined`; `firstTwoRows`: `object`[]; `joinStats`: \{ `averageCount`: `number`; `maxCount`: `number`; `minCount`: `number`; `totalCount`: `number`; \}; `result`: `string`; `success`: `boolean`; \}; \} \| \{ `additionalData`: `undefined`; `llmResult`: \{ `datasetName`: `undefined`; `error`: `string`; `firstTwoRows`: `undefined`; `joinStats`: `undefined`; `result`: `undefined`; `success`: `boolean`; \}; \}\>
