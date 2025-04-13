# Variable: localQuery

> `const` **localQuery**: `ExtendedTool`\<`ZodObject`\<\{ `datasetName`: `ZodString`; `dbTableName`: `ZodString`; `sql`: `ZodString`; `variableNames`: `ZodArray`\<`ZodString`, `"many"`\>; \}, `"strip"`, `ZodTypeAny`, \{ `datasetName`: `string`; `dbTableName`: `string`; `sql`: `string`; `variableNames`: `string`[]; \}, \{ `datasetName`: `string`; `dbTableName`: `string`; `sql`: `string`; `variableNames`: `string`[]; \}\>, \{ `data`: \{ `firstTwoRows`: `any`[]; \}; `error`: `undefined`; `instruction`: `undefined`; `success`: `boolean`; \}, \{ `columnData`: `any`; `config`: \{ `isDraggable`: `boolean`; \}; `datasetName`: `any`; `dbTableName`: `any`; `sql`: `any`; `title`: `string`; `variableNames`: `any`; \}, \{ `config`: \{ `isDraggable`: `boolean`; \}; `duckDB`: `null`; `getValues`: () => `never`; `onSelected`: () => `never`; \}\>

Defined in: [packages/duckdb/src/tool.ts:42](https://github.com/GeoDaCenter/openassistant/blob/ae6e39c15b60e7a98a21d90a5bbeff5dc44c1295/packages/duckdb/src/tool.ts#L42)

The localQuery tool is used to execute a query against a local dataset.

## Example

```typescript
import { localQuery } from '@openassistant/duckdb';

const localQueryTool = {
  ...localQuery,
  context: {
    ...localQuery.context,
    getValues: (datasetName: string, variableName: string) => {
      // get the values of the variable from your dataset, e.g.
      return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
    },
  },
}
```

### getValues()

User implements this function to get the values of the variable from dataset.

For prompts like "_Show me the revenue per capita for each location in dataset myVenues_", the tool will
call the `getValues()` function twice:
- get the values of **revenue** from dataset: getValues('myVenues', 'revenue')
- get the values of **population** from dataset: getValues('myVenues', 'population')

A duckdb table will be created using the values returned from `getValues()`, and LLM will generate a sql query to query the table to answer the user's prompt.

### onSelected()

User implements this function to sync the selections of the query result table with the original dataset.
