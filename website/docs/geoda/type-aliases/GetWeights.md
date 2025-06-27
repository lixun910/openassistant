# Type Alias: GetWeights()

> **GetWeights**: (`datasetName`, `type`, `options`) => `Promise`\<\{ `weights`: `number`[][]; `weightsMeta`: `WeightsMeta`; \}\>

Defined in: [packages/tools/geoda/src/weights/tool.ts:144](https://github.com/GeoDaCenter/openassistant/blob/0f7bf760e453a1735df9463dc799b04ee2f630fd/packages/tools/geoda/src/weights/tool.ts#L144)

## Parameters

### datasetName

`string`

### type

`"knn"` | `"queen"` | `"rook"` | `"threshold"`

### options

#### distanceThreshold?

`number`

#### includeLowerOrder?

`boolean`

#### isMile?

`boolean`

#### k?

`number`

#### orderOfContiguity?

`number`

#### precisionThreshold?

`number`

#### useCentroids?

`boolean`

## Returns

`Promise`\<\{ `weights`: `number`[][]; `weightsMeta`: `WeightsMeta`; \}\>
