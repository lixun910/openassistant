# Type Alias: BoxplotFunctionContext

> **BoxplotFunctionContext**: `object`

Defined in: [boxplot/definition.ts:37](https://github.com/GeoDaCenter/openassistant/blob/a1f850931f3d8289e0a4c297ef4b317a2f84235b/packages/echarts/src/boxplot/definition.ts#L37)

The context of the boxplot function.

## Type declaration

### config?

> `optional` **config**: `object`

#### config.isDraggable?

> `optional` **isDraggable**: `boolean`

#### config.theme?

> `optional` **theme**: `string`

### getValues

> **getValues**: `GetValues`

### onSelected?

> `optional` **onSelected**: [`OnSelectedCallback`](OnSelectedCallback.md)

## Param

Get the values of a variable from the dataset. See [GetValues](GetValues.md) for more details.

## Param

The callback function can be used to sync the selections of the boxplot with the original dataset. See [OnSelectedCallback](OnSelectedCallback.md) for more details.

## Param

The configuration of the boxplot.

## Param

The theme of the boxplot. The possible values are 'light' and 'dark'.

## Param

Whether the boxplot is draggable e.g. to a dashboard.
