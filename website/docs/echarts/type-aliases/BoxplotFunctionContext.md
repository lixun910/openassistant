# Type Alias: BoxplotFunctionContext

> **BoxplotFunctionContext**: `object`

Defined in: [packages/echarts/src/boxplot/definition.ts:38](https://github.com/GeoDaCenter/openassistant/blob/95db62ddd98ea06cccc7750f9f0e37556d8bf20e/packages/echarts/src/boxplot/definition.ts#L38)

Configuration and callback context for the boxplot function.

## Type declaration

### config?

> `optional` **config**: `object`

#### config.isDraggable?

> `optional` **isDraggable**: `boolean`

#### config.isExpanded?

> `optional` **isExpanded**: `boolean`

#### config.theme?

> `optional` **theme**: `string`

### getValues

> **getValues**: `GetValues`

### onSelected?

> `optional` **onSelected**: [`OnSelectedCallback`](OnSelectedCallback.md)

## Param

Function to retrieve values from a dataset. See [GetValues](GetValues.md).

## Param

Optional callback to handle selection events. See [OnSelectedCallback](OnSelectedCallback.md).

## Param

Optional configuration object for the boxplot.

## Param

Visual theme for the boxplot ('light' or 'dark').

## Param

Whether the boxplot can be dragged to other containers.

## Param

Whether the boxplot is expanded.
