// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

export interface MapToolContext {
  getDataset?: (datasetName: string) => Promise<any>;
  getGeometries?: (datasetName: string) => Promise<any>;
}

export function isMapToolContext(context: any): context is MapToolContext {
  return context && (
    typeof context.getDataset === 'function' || 
    typeof context.getGeometries === 'function'
  );
}