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
      if (isRunningRef.current) {
        console.log('Query already running, skipping duplicate invocation');
        return;
      }
      isRunningRef.current = true;

      // Create a new promise for this query
      queryInProgress.current = (async () => {
        try {
          const db = await getDuckDB?.();
          if (!db) {
            throw new Error('DuckDB instance is not initialized');
          }

          const conn = await db.connect();

          // list tables for debugging (optional)
          const tableNames = await conn.query('SHOW TABLES');
          const tableNamesArray = tableNames
            .toArray()
            .map((row) => row.toJSON());
          console.log('Existing tables before recreate:', tableNamesArray);
          // Always drop and recreate the table to ensure consistency
          console.log('Dropping table if exists:', dbTableName);
          await conn.query(`DROP TABLE IF EXISTS ${dbTableName}`);
          
          console.log('Creating table:', dbTableName);
          // create the table
          // get values for each variable
          const columnData = {};
          for (const varName of variableNames) {
            console.log('Getting values for variable:', varName);
            const values = await getValues(datasetName, varName);
            console.log('Values for', varName, ':', values?.length, 'items');
            columnData[varName] = values;
          }
          console.log('Column data structure:', Object.keys(columnData));
          setColumnData(columnData);

          // Create Arrow Table from column data with explicit type
          console.log('Creating Arrow table from column data...');
          const arrowTable: ArrowTable = tableFromArrays(columnData);
          console.log('Arrow table created successfully:', {
            numRows: arrowTable.numRows,
            numCols: arrowTable.numCols,
            schema: arrowTable.schema.fields.map(f => ({ name: f.name, type: f.type.toString() }))
          });
          
          console.log('Inserting Arrow table into DuckDB...');
          await conn.insertArrowTable(arrowTable, {
            name: dbTableName,
            create: true,
          });
          console.log('Arrow table inserted successfully into DuckDB');
          
          // Try to query the table directly to see if it exists
          console.log('Testing table existence by querying it directly...');
          try {
            const testQuery = `SELECT COUNT(*) as count FROM ${dbTableName}`;
            const testResult = await conn.query(testQuery);
            const count = testResult.toArray()[0].toJSON().count;
            console.log('Direct query test successful, row count:', count);
          } catch (testError) {
            console.error('Direct query test failed:', testError);
          }
          
          // Verify the table was created by checking tables again
          const tablesAfterInsert = await conn.query('SHOW TABLES');
          const tablesAfterInsertArray = tablesAfterInsert
            .toArray()
            .map((row) => row.toJSON());
          console.log('Tables after insert:', tablesAfterInsertArray);
          const tableExistsAfterInsert = tablesAfterInsertArray.find(
            (table) => table.name === dbTableName
          );
          console.log('Table exists after insert:', !!tableExistsAfterInsert);
          
          // Fallback: if the table is still not visible, explicitly create it with a schema
          if (!tableExistsAfterInsert) {
            console.log('Fallback: creating table explicitly with schema');
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
            console.log('Executing explicit CREATE TABLE:', createSql);
            await conn.query(createSql);
            console.log('Explicit CREATE TABLE done, inserting rows...');
            await conn.insertArrowTable(arrowTable, {
              name: dbTableName,
              create: false,
            });
            console.log('Rows inserted after explicit CREATE TABLE');
            const tablesAfterCreate = await conn.query('SHOW TABLES');
            const tablesAfterCreateArray = tablesAfterCreate
              .toArray()
              .map((row) => row.toJSON());
            console.log('Tables after explicit create:', tablesAfterCreateArray);

            // Post-insert sanity checks
            try {
              const countRes = await conn.query(`SELECT COUNT(*) AS count FROM ${escapeIdent(dbTableName)}`);
              let insertedCount = countRes.toArray()[0].toJSON().count;
              console.log('Row count after explicit insert:', insertedCount);
              if (!insertedCount || insertedCount === 0 || insertedCount === 0n) {
                console.log('Fallback insert path: inserting rows one-by-one');
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
                const recountRes = await conn.query(`SELECT COUNT(*) AS count FROM ${escapeIdent(dbTableName)}`);
                insertedCount = recountRes.toArray()[0].toJSON().count;
                console.log('Row count after manual inserts:', insertedCount);
              }
              const previewRes = await conn.query(`SELECT * FROM ${escapeIdent(dbTableName)} LIMIT 5`);
              const previewJson = previewRes.toArray().map((r) => r.toJSON());
              console.log('Preview rows after explicit insert:', previewJson);
            } catch (postCheckErr) {
              console.error('Post-insert sanity check failed:', postCheckErr);
            }
          }

          // query the table
          console.log('Executing query:', sql);
          console.log('Using connection for query...');
          const arrowResult = await conn.query(sql);
          console.log('Query executed successfully');

          // get query results
          const queryResult = arrowResult.toArray().map((row) => row.toJSON());
          console.log('Query returned rows:', queryResult.length, 'First row:', queryResult[0] ?? null);
          if (queryResult.length === 0) {
            try {
              const countAllRes = await conn.query(`SELECT COUNT(*) AS count FROM "${dbTableName}"`);
              const totalRows = countAllRes.toArray()[0].toJSON().count;
              console.log('Total rows in source table:', totalRows);
              const previewAllRes = await conn.query(`SELECT * FROM "${dbTableName}" LIMIT 5`);
              const previewAll = previewAllRes.toArray().map((r) => r.toJSON());
              console.log('Preview of source table (first 5):', previewAll);
              for (const varName of variableNames) {
                try {
                  const distinctRes = await conn.query(`SELECT DISTINCT "${varName}" AS v FROM "${dbTableName}" LIMIT 10`);
                  const vals = distinctRes.toArray().map((r) => r.toJSON().v);
                  console.log(`Distinct ${varName} (up to 10):`, vals);
                } catch (dErr) {
                  console.warn(`Failed to fetch distinct values for ${varName}:`, dErr);
                }
              }
            } catch (diagErr) {
              console.warn('Diagnostics after zero-row query failed:', diagErr);
            }
          }
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
    <div className="text-tiny p-2">No results.</div>
  );
}
