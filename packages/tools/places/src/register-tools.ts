// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

export interface FoursquareToolContext {
  getFsqToken: () => string;
  getGeometries?: (datasetName: string) => Promise<any>;
}

export function isFoursquareToolContext(context: any): context is FoursquareToolContext {
  return context && typeof context.getFsqToken === 'function';
}

export interface SearchAPIToolContext {
  getSearchAPIKey: () => string;
}

export function isSearchAPIToolContext(context: any): context is SearchAPIToolContext {
  return context && typeof context.getSearchAPIKey === 'function';
}