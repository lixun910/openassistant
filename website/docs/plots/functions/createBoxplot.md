# Function: createBoxplot()

> **createBoxplot**(`props`): [`BoxplotDataProps`](../type-aliases/BoxplotDataProps.md)

Defined in: [packages/tools/plots/src/echarts/boxplot/utils.ts:90](https://github.com/geodaopenjs/openassistant/blob/0a6a7e7306d75a25dc968b3117f04cb7bd613bec/packages/tools/plots/src/echarts/boxplot/utils.ts#L90)

Create a boxplot from a list of numbers and option boundIQR (1.5 or 3.0)

## Parameters

### props

[`CreateBoxplotProps`](../type-aliases/CreateBoxplotProps.md)

The properties object containing:

## Returns

[`BoxplotDataProps`](../type-aliases/BoxplotDataProps.md)

The boxplot data containing statistical properties and mean points

### Example: single boxplot

```ts
const data = {
  'samples': [1, 2, 3, 4, 5],
};
const boundIQR = 1.5;
const boxplotData = createBoxplot({data, boundIQR});
```

### Example: multiple boxplots

```ts
const data = {
  'samples': [1, 2, 3, 4, 5],
  'samples2': [6, 7, 8, 9, 10],
};
const boundIQR = 1.5;
const boxplotData = createBoxplot({data, boundIQR});
```
