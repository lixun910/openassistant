# Type Alias: HistogramFunctionContext

> **HistogramFunctionContext**: `object`

Defined in: [packages/echarts/src/histogram/definition.ts:42](https://github.com/GeoDaCenter/openassistant/blob/994a31d776db171047aa7cd650eb798b5317f644/packages/echarts/src/histogram/definition.ts#L42)

The context of the histogram function.

## Type declaration

### config?

> `optional` **config**: `object`

#### config.isDraggable?

> `optional` **isDraggable**: `boolean`

#### config.theme?

> `optional` **theme**: `string`

### getValues

> **getValues**: [`GetValues`](GetValues.md)

### onSelected?

> `optional` **onSelected**: `OnSelectedCallback`

## Param

Get the values of a variable from the dataset. See [GetValues](GetValues.md) for more details.

## Param

The callback function can be used to sync the selections of the histogram plot with the original dataset. See [OnSelectedCallback](OnSelectedCallback.md) for more details.

## Param

The configuration of the histogram plot.

## Param

The theme of the histogram plot. The possible values are 'light' and 'dark'.

## Param

Whether the histogram plot is draggable e.g. to a dashboard.
