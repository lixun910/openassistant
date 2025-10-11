// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { SpatialGeometry } from '@geoda/core';

export type GetDataset = (datasetName: string) => Promise<unknown>;

export type GetGeometries = (
  datasetName: string
) => Promise<SpatialGeometry | null>;

export type MapToolContext = {
  getDataset?: GetDataset;
  getGeometries?: GetGeometries;
};

export function isMapToolContext(context: unknown): context is MapToolContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    ('getDataset' in context || 'getGeometries' in context)
  );
}