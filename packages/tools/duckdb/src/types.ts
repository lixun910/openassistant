// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { AsyncDuckDB } from '@duckdb/duckdb-wasm';


/**
 * Context object for the localQuery tool
 */
export type LocalQueryContext = {
  /**
   * Function to get values from a dataset
   * @param datasetName - The name of the dataset
   * @param variableName - The name of the variable to get values for
   * @returns An array of values for the specified variable
   */
  getValues: (datasetName: string, variableName: string) => Promise<unknown[]>;

  /**
   * Optional DuckDB instance for querying
   */
  getDuckDB?: () => Promise<AsyncDuckDB | null>;
};

/**
 * LLM result type for localQuery
 */
export type LocalQueryLlmResult = {
  success: boolean;
  datasetName?: string;
  error?: string;
  instruction?: string;
  firstRow?: Record<string, unknown>;
};


/**
 * Additional data returned with the query result
 */
export type LocalQueryAdditionalData = {
  sql: string;
  columnData?: Record<string, unknown[]>;
  queryDatasetName: string;
  datasetName: string;
  dbTableName: string;
  variableNames: string[];
};
