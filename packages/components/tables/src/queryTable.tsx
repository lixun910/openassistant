// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { ChangeEvent, useEffect, useMemo, useState, useRef } from 'react';
import { Table as ArrowTable, tableFromArrays } from 'apache-arrow';
import { AsyncDuckDB } from '@duckdb/duckdb-wasm';
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
 * If you are using `localQuery` tool using Vercel AI SDK `useChat()` and `streamText()` etc.
 * You can use `QueryDuckDBComponent` to render the results of `localQuery` tool.
 *
 * ## Example with Vercel AI SDK
 * ```tsx
 *
 * ```
 *
 * If you using `@openassistant/ui` chat component, you can use `QueryDuckDBComponent` as the tool component of `localQuery` tool.
 *
 * ## Example with `@openassistant/ui`
 *
 * ```tsx
 * import { localQuery, LocalQueryTool, getDuckDB } from '@openassistant/duckdb';
 * import { QueryDuckDBComponent, QueryDuckDBOutputData } from '@openassistant/tables';
 * import { SAMPLE_DATASETS } from './dataset';
 *
 * function getValues(datasetName: string, variableName: string) {
 *   // simulate get values from a dataset by variable name
 *   return Promise.resolve(
 *     SAMPLE_DATASETS[datasetName as keyof typeof SAMPLE_DATASETS].map(
 *       (item) => item[variableName as keyof typeof item]
 *     )
 *   );
 * }
 *
 * // Here we need to wrap the QueryDuckDBComponent with a component that
 * // can get the values from the dataset by variable name via `getValues()` function and
 * // the duckdb instance which can be get via getDuckDB() function.
 * function QueryToolComponent(props: QueryDuckDBOutputData) {
 *   return (
 *     <QueryDuckDBComponent
 *       {...props}
 *       getValues={getValues}
 *       getDuckDB={getDuckDB}
 *     />
 *   );
 * }
 *
 * const localQueryTool: LocalQueryTool = {
 *   ...localQuery,
 *   context: {
 *     ...localQuery.context,
 *     getValues,
 *   },
 *   // use the wrapped QueryToolComponent as the component of the tool
 *   component: QueryToolComponent,
 * };
 *
 * // use the localQueryTool in the @openassistant/ui
 * <AiAssistant
 *   ...
 *   tools={localQueryTool}
 * />
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
      // If a query is already in progress, wait for it to complete
      if (queryInProgress.current) {
        await queryInProgress.current;
      }

      // Create a new promise for this query
      queryInProgress.current = (async () => {
        try {
          const db = await getDuckDB?.();
          if (!db) {
            throw new Error('DuckDB instance is not initialized');
          }

          const conn = await db.connect();

          // check if dbTableName exists
          const tableNames = await conn.query('SHOW TABLES');
          const tableNamesArray = tableNames
            .toArray()
            .map((row) => row.toJSON());
          const tableExists = tableNamesArray.find(
            (table) => table.name === dbTableName
          );
          if (!tableExists) {
            // create the table
            // get values for each variable
            const columnData = {};
            for (const varName of variableNames) {
              columnData[varName] = await getValues(datasetName, varName);
            }
            setColumnData(columnData);

            // Create Arrow Table from column data with explicit type
            const arrowTable: ArrowTable = tableFromArrays(columnData);
            const conn = await db.connect();
            await conn.insertArrowTable(arrowTable, {
              name: dbTableName,
              create: true,
            });
          }

          // query the table
          const arrowResult = await conn.query(sql);

          // get query results
          const queryResult = arrowResult.toArray().map((row) => row.toJSON());
          setQueryResult(queryResult);

          await conn.close();
        } catch (error) {
          setError(error instanceof Error ? error.message : String(error));
        } finally {
          queryInProgress.current = null;
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

  return error ? (
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
  ) : null;
}
