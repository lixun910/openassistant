# Variable: BoxplotFunction

> `const` **BoxplotFunction**: `object`

Defined in: [packages/echarts/src/boxplot/definition.ts:61](https://github.com/GeoDaCenter/openassistant/blob/a9f2271d1019f6c25c10dd4b3bdb64fcf16999b2/packages/echarts/src/boxplot/definition.ts#L61)

## Type declaration

### description

> **description**: `string` = `'Create a boxplot'`

### name

> **name**: `string` = `'boxplot'`

### properties

> **properties**: `object`

#### properties.boundIQR

> **boundIQR**: `object`

#### properties.boundIQR.description

> **description**: `string` = `'The bound of the IQR to create a boxplot. The default value is 1.5.'`

#### properties.boundIQR.type

> **type**: `string` = `'number'`

#### properties.datasetName

> **datasetName**: `object`

#### properties.datasetName.description

> **description**: `string` = `'The name of the dataset to create a boxplot. If not provided, use the first dataset or ask user to select or upload a dataset.'`

#### properties.datasetName.type

> **type**: `string` = `'string'`

#### properties.variableNames

> **variableNames**: `object`

#### properties.variableNames.description

> **description**: `string` = `'The names of the variables to create a boxplot'`

#### properties.variableNames.items

> **items**: `object`

#### properties.variableNames.items.type

> **type**: `string` = `'string'`

#### properties.variableNames.type

> **type**: `string` = `'array'`

### required

> **required**: `string`[]
