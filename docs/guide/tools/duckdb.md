# DuckDB Tools

The `@openassistant/duckdb` package provides tools for executing SQL queries directly in the browser using DuckDB WASM.

## Installation

```bash
npm install @openassistant/duckdb
```

## Available Tools

### LocalQueryTool

Execute SQL queries on data provided through the context.

**Use Cases:**
- Analyze tabular data with SQL
- Aggregate and transform datasets
- Join multiple data sources
- Statistical computations

### MergeTablesTool

Merge multiple datasets based on common keys.

**Use Cases:**
- Combine related datasets
- Left/right/inner joins
- Data enrichment

## Basic Usage

### Setting Up

```typescript
import { LocalQueryTool } from '@openassistant/duckdb';
import { tool } from 'ai';

const queryTool = new LocalQueryTool({
  context: {
    getValues: async (datasetName: string, variableName: string) => {
      // Return array of values for the specified variable
      return await fetchDataFromYourSource(datasetName, variableName);
    },
  },
});

// Convert to Vercel AI SDK tool
const aiTool = queryTool.toVercelAiTool(tool);
```

### Example Queries

```typescript
// Simple aggregation
const result = await queryTool.execute({
  query: `
    SELECT 
      AVG(population) as avg_population,
      SUM(area) as total_area
    FROM dataset
  `
});

// Grouping and filtering
const result = await queryTool.execute({
  query: `
    SELECT 
      state,
      COUNT(*) as city_count,
      AVG(population) as avg_population
    FROM cities
    WHERE population > 100000
    GROUP BY state
    ORDER BY avg_population DESC
  `
});

// Window functions
const result = await queryTool.execute({
  query: `
    SELECT 
      city,
      population,
      RANK() OVER (ORDER BY population DESC) as rank
    FROM cities
  `
});
```

## Advanced Features

### Working with Spatial Data

DuckDB supports spatial operations when combined with GeoJSON data:

```typescript
const result = await queryTool.execute({
  query: `
    SELECT 
      ST_Area(geometry) as area,
      ST_Centroid(geometry) as center
    FROM spatial_data
  `
});
```

### Using CTEs (Common Table Expressions)

```typescript
const result = await queryTool.execute({
  query: `
    WITH top_cities AS (
      SELECT * FROM cities
      WHERE population > 500000
    )
    SELECT 
      state,
      COUNT(*) as large_city_count
    FROM top_cities
    GROUP BY state
  `
});
```

### Merging Tables

```typescript
import { MergeTablesTool } from '@openassistant/duckdb';

const mergeTool = new MergeTablesTool({
  context: {
    getTableData: async (tableName: string) => {
      return await fetchTable(tableName);
    },
  },
});

const result = await mergeTool.execute({
  leftTable: 'cities',
  rightTable: 'demographics',
  leftKey: 'city_id',
  rightKey: 'city_id',
  joinType: 'inner'
});
```

## Context Requirements

The `getValues` function should return an array of values for the specified dataset and variable:

```typescript
context: {
  getValues: async (datasetName: string, variableName: string) => {
    // Example: Fetch from API
    const response = await fetch(
      `/api/data/${datasetName}/${variableName}`
    );
    const data = await response.json();
    return data.values; // Array of values
  }
}
```

## Performance Tips

1. **Limit Result Sets**: Use `LIMIT` for large datasets
2. **Create Indexes**: For repeated queries on the same data
3. **Use Appropriate Data Types**: Helps query optimization
4. **Cache Results**: Store frequently accessed query results

```typescript
import { ToolCache } from '@openassistant/utils';

const cache = new ToolCache();
const cacheKey = `query-${datasetName}-${queryHash}`;

const result = await cache.getOrCompute(cacheKey, async () => {
  return await queryTool.execute({ query });
});
```

## Error Handling

```typescript
const result = await queryTool.execute({ query });

if (result.error) {
  console.error('Query failed:', result.error);
  // Handle SQL syntax errors, missing tables, etc.
} else {
  console.log('Query succeeded:', result.data);
}
```

## Complete Example

```typescript
import { LocalQueryTool } from '@openassistant/duckdb';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { tool } from 'ai';

// Set up the tool
const queryTool = new LocalQueryTool({
  context: {
    getValues: async (datasetName, variableName) => {
      // Your data fetching logic
      const data = await myDatabase.get(datasetName, variableName);
      return data;
    },
  },
});

// Use with AI
const result = await generateText({
  model: openai('gpt-4'),
  tools: {
    query_database: queryTool.toVercelAiTool(tool),
  },
  prompt: `
    Analyze the cities dataset and tell me:
    1. Which state has the most cities?
    2. What is the average population?
    3. Which cities have population over 1 million?
  `,
});

console.log(result.text);
```

## API Reference

For detailed API documentation, see the [DuckDB API Reference](/api/@openassistant/duckdb/README).

## Next Steps

- [GeoDA Tools](/guide/tools/geoda) - Spatial analysis tools
- [Plots Tools](/guide/tools/plots) - Visualize query results
- [Map Tools](/guide/tools/map) - Display spatial query results on maps

