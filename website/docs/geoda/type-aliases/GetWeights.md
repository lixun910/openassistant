# Type Alias: GetWeights()

> **GetWeights**: (`datasetName`, `type`, `options`) => `Promise`\<\{ `weights`: `number`[][]; `weightsMeta`: `WeightsMeta`; \}\>

Defined in: [packages/tools/geoda/src/weights/tool.ts:144](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/geoda/src/weights/tool.ts#L144)

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
