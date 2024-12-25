# DuckDB addon for react-ai-assist

This addon provides a way to query your dataset or selected columns using DuckDB WASM database via the Ai assistant chat interface in react-ai-assist.

## Installation

This addon depends on the following packages:
- react-ai-assist
- duckdb-wasm
- apache-arrow

If you are using tailwindcss, you can install the addon by running:

```bash
yarn add react-ai-assist @ai-assist/duckdb @duckdb/duckdb-wasm apache-arrow
```

Then, you need to add the following to your tailwind.config.js file:

```js
   content: [
     ...,
     './node_modules/@ai-assist/duckdb/dist/**/*.{js,ts,jsx,tsx}',
   ]
```

## Usage

To use this addon, you need to import the `queryDuckDBCallbackMessage` component from the addon and pass the `db` object to it.

```tsx
import { AiAssistant } from 'react-ai-assist';
import { queryDuckDBFunctionDefinition } from '@ai-assist/duckdb';

const myFunctions = [
  ...otherFunctions,
  queryDuckDBFunctionDefinition({
    getValues: (datasetName: string, variableName: string) => {
      // get the values of the variable from the dataset,
      // the values will be used to create and plot the histogram
      return [];
    }
  }),
];

<AiAssistant
  provider="openai"
  model="gpt-4o"
  apiKey="your-api-key"
  name="My AI Assistant"
  version="1.0.0"
  functions={myFunctions}
/>
```

With the above code, the AI assistant will be able to query the dataset or selected columns using DuckDB WASM database. Users can prompt the AI assistant to query the dataset or selected columns by asking it to query the dataset or selected columns.

For example:

```
Query the dataset "my_dataset" and select the top 10 rows of the column "age".
```
