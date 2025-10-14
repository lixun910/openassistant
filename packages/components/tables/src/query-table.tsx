// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { ChangeEvent, useEffect, useMemo, useState, useRef } from 'react';
import { Table as ArrowTable, tableFromArrays } from 'apache-arrow';
import { AsyncDuckDB, AsyncDuckDBConnection } from '@duckdb/duckdb-wasm';
import {
  Table,
  TableColumn,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Selection,
} from '@heroui/table';
import { Select, SelectItem } from '@heroui/select';
import { Pagination } from '@heroui/pagination';
import { Checkbox } from '@heroui/checkbox';
import './index.css';

/**
 * Inserts columnar data into a DuckDB table with fallback mechanisms
 * @param conn - DuckDB connection
 * @param columnData - Object with column names as keys and arrays of values as values
 * @param dbTableName - Name of the table to create/insert into
 * @param arrowTable - Arrow table representation of the data
 */
async function insertColumnarData(
  conn: AsyncDuckDBConnection,
  columnData: Record<string, unknown[]>,
  dbTableName: string,
  arrowTable: ArrowTable
): Promise<void> {
  const escapeIdent = (s: string) => '"' + String(s).replace(/"/g, '""') + '"';
  
  const inferDuckDBType = (values: unknown[]): string => {
    const first = values.find((v) => v !== null && v !== undefined);
    if (typeof first === 'boolean') return 'BOOLEAN';
    if (typeof first === 'number') {
      return Number.isInteger(first) ? 'BIGINT' : 'DOUBLE';
    }
    if (typeof first === 'string') return 'VARCHAR';
    // default to VARCHAR for complex types
    return 'VARCHAR';
  };

  const columnDefs = Object.entries(columnData)
    .map(([colName, values]) => `${escapeIdent(colName)} ${inferDuckDBType(values as unknown[])}`)
    .join(', ');
  const createSql = `CREATE TABLE ${escapeIdent(dbTableName)} (${columnDefs})`;
  await conn.query(createSql);
  
  await conn.insertArrowTable(arrowTable, {
    name: dbTableName,
    create: false,
  });

  // Verify insertion was successful
  const countRes = await conn.query(`SELECT COUNT(*) AS count FROM ${escapeIdent(dbTableName)}`);
  const insertedCount = countRes.toArray()[0].toJSON().count;
  
  if (!insertedCount || insertedCount === 0 || insertedCount === BigInt(0)) {
    const escapeSqlString = (s: unknown) => {
      if (s === null || s === undefined) return 'NULL';
      if (typeof s === 'number' || typeof s === 'bigint') return String(s);
      if (typeof s === 'boolean') return s ? 'TRUE' : 'FALSE';
      return '\'' + String(s).replace(/'/g, "''") + '\'';
    };
    
    const colNames = Object.keys(columnData);
    const numRowsToInsert = (columnData[colNames[0]] as unknown[]).length;
    
    for (let i = 0; i < numRowsToInsert; i++) {
      const valuesSql = colNames
        .map((c) => escapeSqlString((columnData[c] as unknown[])[i]))
        .join(', ');
      const insertSql = `INSERT INTO ${escapeIdent(dbTableName)} (${colNames.map(escapeIdent).join(', ')}) VALUES (${valuesSql})`;
      await conn.query(insertSql);
    }
  }
}

// type guard for QueryDuckDBOutputData
export function isQueryDuckDBOutputData(
  data: unknown
): data is QueryDuckDBOutputData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'variableNames' in data &&
    'datasetName' in data &&
    'sql' in data &&
    'dbTableName' in data
  );
}

export type OnSelected = (
  datasetName: string,
  columnName: string,
  selectedValues: unknown[]
) => void;

export type QueryDuckDBOutputData = {
  variableNames: string[];
  datasetName: string;
  sql: string;
  dbTableName: string;
};

/**
 * QueryDuckDBComponent is a component that displays a table of query results from DuckDB.
 * This component is designed to be used with `localQuery` tool from @openassistant/duckdb.
 *
 * If you are using `localQuery` tool with Vercel AI SDK `useChat()` and `streamText()` etc.,
 * you can use `QueryDuckDBComponent` to render the results of `localQuery` tool.
 *
 * ## Example with sqlrooms/ai
 *
 * ```tsx
 * import { localQuery, getDuckDB } from '@openassistant/duckdb';
 * import { QueryDuckDBComponent, QueryDuckDBOutputData } from '@openassistant/tables';
 * import { createChatStore } from 'sqlrooms/ai';
 *
 * const SAMPLE_DATASETS = {
 *   venues: [
 *     { name: 'Golden Gate Park', city: 'San Francisco', rating: 4.5 },
 *     { name: "Fisherman's Wharf", city: 'San Francisco', rating: 4.2 },
 *     { name: 'Alcatraz Island', city: 'San Francisco', rating: 4.7 },
 *   ],
 * };
 *
 * const getValues = async (datasetName: string, variableName: string) => {
 *   // Get the values of the variable from your dataset
 *   const dataset = SAMPLE_DATASETS[datasetName as keyof typeof SAMPLE_DATASETS];
 *   if (!dataset) {
 *     throw new Error(`Dataset '${datasetName}' not found`);
 *   }
 *   return dataset.map((item) => item[variableName as keyof typeof item]);
 * };
 *
 * // Create tool with custom context
 * const localQueryTool = {
 *   ...localQuery,
 *   context: { getValues },
 *   onToolCompleted: (toolCallId: string, additionalData: unknown) => {
 *     // Handle query completion
 *   },
 *   component: (props: QueryDuckDBOutputData) => {
 *     return (
 *       <QueryDuckDBComponent
 *         {...props}
 *         getDuckDB={getDuckDB}
 *         getValues={getValues}
 *       />
 *     );
 *   },
 * };
 *
 * // Use sqlrooms/ai chat store
 * const useChatStore = createChatStore({
 *   ai: {
 *     getInstructions: () => 'You are a helpful assistant that can answer questions and help with tasks.',
 *     tools: { localQuery: localQueryTool },
 *   },
 * });
 * ```
 */
export function QueryDuckDBComponent({
  variableNames,
  datasetName,
  sql,
  dbTableName,
  onSelected,
  getDuckDB,
  getValues,
}: QueryDuckDBOutputData & {
  onSelected?: OnSelected;
  getDuckDB?: (
    externalDB?: AsyncDuckDB | undefined
  ) => Promise<AsyncDuckDB | null>;
  getValues: (datasetName: string, variableName: string) => Promise<unknown[]>;
}): JSX.Element | null {
  const queryInProgress = useRef<Promise<void> | null>(null);
  const isRunningRef = useRef(false);
  const [columnData, setColumnData] = useState<{ [key: string]: unknown[] }>(
    {}
  );

  // sync selections by
  const [syncSelection, setSyncSelection] = useState(false);
  const [syncSelectionBy, setSyncSelectionBy] = useState<string | null>(null);
  // selected rows
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  // query result
  const [queryResult, setQueryResult] = useState<unknown[]>([]);

  // error handling
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(queryResult.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return queryResult.slice(start, end);
  }, [page, queryResult]);

  useEffect(() => {
    const query = async () => {
      // Prevent concurrent runs (React Strict Mode double-invokes effects)
      if (isRunningRef.current) return;
      isRunningRef.current = true;

      // Create a new promise for this query
      queryInProgress.current = (async () => {
        try {
          const db = await getDuckDB?.();
          if (!db) {
            throw new Error('DuckDB instance is not initialized');
          }

          const conn = await db.connect();

          await conn.query(`DROP TABLE IF EXISTS ${dbTableName}`);
          
          // create the table
          // get values for each variable
          const columnData = {};
          for (const varName of variableNames) {
            const values = await getValues(datasetName, varName);
            columnData[varName] = values;
          }
          setColumnData(columnData);

          // Create Arrow Table from column data with explicit type
          const arrowTable: ArrowTable = tableFromArrays(columnData);
          await conn.insertArrowTable(arrowTable, {
            name: dbTableName,
            create: true,
          });
          
          // Verify the table was created by checking tables again
          const tablesAfterInsert = await conn.query('SHOW TABLES');
          const tablesAfterInsertArray = tablesAfterInsert
            .toArray()
            .map((row) => row.toJSON());
          const tableExistsAfterInsert = tablesAfterInsertArray.find(
            (table) => table.name === dbTableName
          );
          
          // Fallback: if the table is still not visible, explicitly create it with a schema
          if (!tableExistsAfterInsert) {
            await insertColumnarData(conn, columnData, dbTableName, arrowTable);
          }

          // Execute the query
          const arrowResult = await conn.query(sql);
          const queryResult = arrowResult.toArray().map((row) => row.toJSON());
          setQueryResult(queryResult);

          await conn.close();
        } catch (error) {
          setError(error instanceof Error ? error.message : String(error));
        } finally {
          queryInProgress.current = null;
          isRunningRef.current = false;
        }
      })();

      // Wait for the query to complete
      await queryInProgress.current;
    };

    query();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sql]);

  const onSyncSelection = (e: ChangeEvent<HTMLInputElement>) => {
    setSyncSelection(e.target.checked);
    if (e.target.checked === false) {
      if (syncSelectionBy) {
        onSelected?.(datasetName, syncSelectionBy, []);
      }
    }
  };

  const onSyncSelectionBy = (e: ChangeEvent<HTMLSelectElement>) => {
    setSyncSelectionBy(e.target.value);
  };

  useEffect(() => {
    if (syncSelection) {
      const selectedRows = Array.from(selectedKeys).map((v) =>
        parseInt(v.toString(), 10)
      );
      // get the value of the syncSelectionBy variable
      const syncSelectionByValue = syncSelectionBy
        ? columnData[syncSelectionBy]
        : null;
      // filter syncSelectionByValue with selectedRows
      const filteredSyncSelectionByValue = syncSelectionByValue
        ? selectedRows.map((row) => syncSelectionByValue[row])
        : null;
      // if filteredSyncSelectionByValue is not null, call the onSelected callback
      if (filteredSyncSelectionByValue && syncSelectionBy) {
        onSelected?.(
          datasetName,
          syncSelectionBy,
          filteredSyncSelectionByValue
        );
      }
    }
  }, [
    selectedKeys,
    syncSelection,
    syncSelectionBy,
    columnData,
    onSelected,
    datasetName,
  ]);

  return error && error !== 'DuckDB instance is not initialized' ? (
    <div>
      <p className="text-tiny">Something went wrong with the query.</p>
      {error}
    </div>
  ) : queryResult.length > 0 ? (
    <div className="overflow-auto resize pb-3 w-full h-[450px]">
      <div className="flex flex-col gap-4 max-w-full">
        <span className="text-tiny font-bold mt-2">Query Result</span>
        <Table
          aria-label="Query Result Table"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
                size="sm"
                hidden={pages <= 1}
              />
            </div>
          }
          classNames={{
            wrapper: 'max-h-[420px] max-w-full overflow-x-auto',
            base: 'overflow-scroll p-0 m-0 text-tiny',
            table: 'p-0 m-0 text-tiny',
            th: 'text-tiny',
            td: 'text-[9px]',
          }}
          isHeaderSticky
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          selectionBehavior="replace"
          disallowEmptySelection={false}
          onSelectionChange={setSelectedKeys}
          removeWrapper={true}
        >
          <TableHeader>
            {Object.keys(queryResult[0] || {}).map((key) => (
              <TableColumn key={key}>{key}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {items.map((row, i) => (
              <TableRow
                key={`0${(row as Record<string, unknown>)['row_index'] || i}`}
              >
                {Object.values(row as Record<string, unknown>).map(
                  (value, j) => (
                    <TableCell key={j}>
                      {typeof value === 'number' && !Number.isInteger(value)
                        ? value.toFixed(3)
                        : String(value)}
                    </TableCell>
                  )
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {onSelected && (
          <div className="flex flex-row gap-2 pl-2 text-tiny">
            <Checkbox
              size="sm"
              classNames={{ label: 'text-tiny' }}
              onChange={onSyncSelection}
            >
              sync selections by
            </Checkbox>
            <div className="flex-1">
              <Select
                size="sm"
                onChange={onSyncSelectionBy}
                aria-label="Select column for synchronization"
              >
                {variableNames.map((name) => (
                  <SelectItem key={name}>{name}</SelectItem>
                ))}
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="text-tiny p-2"></div>
  );
}
