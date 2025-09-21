// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

/**
 * Base interface for all tool contexts
 */
export interface BaseToolContext {
  /**
   * Optional metadata about the context
   */
  metadata?: Record<string, unknown>;
}

/**
 * Context for tools that need to access data values
 */
export interface DataAccessContext extends BaseToolContext {
  /**
   * Function to get values from a dataset
   * @param datasetName - The name of the dataset
   * @param variableName - The name of the variable to get values for
   * @returns An array of values for the specified variable
   */
  getValues?: (datasetName: string, variableName: string) => Promise<unknown[]>;
}

/**
 * Context for tools that need to access geometries
 */
export interface GeometryAccessContext extends BaseToolContext {
  /**
   * Function to get geometries from a dataset
   * @param datasetName - The name of the dataset
   * @returns The geometries of the dataset
   */
  getGeometries?: (datasetName: string) => Promise<unknown>;
}

/**
 * Context for tools that need API tokens
 */
export interface ApiTokenContext extends BaseToolContext {
  /**
   * Function to get API token
   * @returns The API token
   */
  getApiToken?: () => string | Promise<string>;
}

/**
 * Context for tools that need specific API tokens
 */
export interface MapboxTokenContext extends BaseToolContext {
  getMapboxToken?: () => string | Promise<string>;
}

export interface FoursquareTokenContext extends BaseToolContext {
  getFsqToken?: () => string | Promise<string>;
}

export interface SearchApiTokenContext extends BaseToolContext {
  getSearchAPIKey?: () => string | Promise<string>;
}

/**
 * Context for tools that need dataset access
 */
export interface DatasetAccessContext extends BaseToolContext {
  getDataset?: (datasetName: string) => Promise<unknown>;
}

/**
 * Context for tools that need selection handling
 */
export interface SelectionContext extends BaseToolContext {
  onSelected?: (datasetName: string, selectedIndices: number[]) => void;
}

/**
 * Context for tools that need configuration
 */
export interface ConfigContext extends BaseToolContext {
  config?: Record<string, unknown>;
}

/**
 * Type guard functions
 */
export function isDataAccessContext(context: unknown): context is DataAccessContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    ('getValues' in context || Object.keys(context).length === 0)
  );
}

export function isGeometryAccessContext(context: unknown): context is GeometryAccessContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    ('getGeometries' in context || Object.keys(context).length === 0)
  );
}

export function isApiTokenContext(context: unknown): context is ApiTokenContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    ('getApiToken' in context || Object.keys(context).length === 0)
  );
}

export function isMapboxTokenContext(context: unknown): context is MapboxTokenContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    ('getMapboxToken' in context || Object.keys(context).length === 0)
  );
}

export function isFoursquareTokenContext(context: unknown): context is FoursquareTokenContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    ('getFsqToken' in context || Object.keys(context).length === 0)
  );
}

export function isSearchApiTokenContext(context: unknown): context is SearchApiTokenContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    ('getSearchAPIKey' in context || Object.keys(context).length === 0)
  );
}

export function isDatasetAccessContext(context: unknown): context is DatasetAccessContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    ('getDataset' in context || Object.keys(context).length === 0)
  );
}

export function isSelectionContext(context: unknown): context is SelectionContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    ('onSelected' in context || Object.keys(context).length === 0)
  );
}

export function isConfigContext(context: unknown): context is ConfigContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    ('config' in context || Object.keys(context).length === 0)
  );
}