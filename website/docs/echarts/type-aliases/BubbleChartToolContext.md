# Type Alias: BubbleChartToolContext

> **BubbleChartToolContext**: `object`

Defined in: [packages/echarts/src/bubble-chart/tool.ts:182](https://github.com/GeoDaCenter/openassistant/blob/ae6e39c15b60e7a98a21d90a5bbeff5dc44c1295/packages/echarts/src/bubble-chart/tool.ts#L182)

The context for the bubble chart tool.

## Type declaration

### config?

> `optional` **config**: `object`

#### config.isDraggable?

> `optional` **isDraggable**: `boolean`

#### config.isExpanded?

> `optional` **isExpanded**: `boolean`

#### config.theme?

> `optional` **theme**: `string`

### getValues()

> **getValues**: (`datasetName`, `variableName`) => `Promise`\<`number`[]\>

#### Parameters

##### datasetName

`string`

##### variableName

`string`

#### Returns

`Promise`\<`number`[]\>

### onSelected()?

> `optional` **onSelected**: (`datasetName`, `selectedIndices`) => `void`

#### Parameters

##### datasetName

`string`

##### selectedIndices

`number`[]

#### Returns

`void`

## Param

The function to get the values of the variable from the dataset.

## Param

The function to handle the selected indices of the bubble chart.

## Param

The configuration for the bubble chart.
