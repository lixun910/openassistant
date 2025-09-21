// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OnToolCompleted } from '@openassistant/utils';
import { createToolRegistry } from '@openassistant/tools-shared';
import { SpatialToolContext } from './types';

import { dataClassify } from './data-classify/tool';
import { lisa } from './lisa/tool';
import { globalMoran } from './global-moran/tool';
import { spatialRegression } from './regression/tool';
import { spatialJoin } from './spatial_join/tool';
import { spatialFilter } from './spatial_join/spatial-filter';
import { spatialWeights } from './weights/tool';
import { area } from './spatial_ops/area';
import { buffer } from './spatial_ops/buffer';
import { centroid } from './spatial_ops/centroid';
import { dissolve } from './spatial_ops/dissolve';
import { grid } from './spatial_ops/grid';
import { length } from './spatial_ops/length';
import { perimeter } from './spatial_ops/perimeter';
import { thiessenPolygons } from './spatial_ops/thiessenPolygons';
import { minimumSpanningTree } from './spatial_ops/mst';
import { cartogram } from './spatial_ops/cartogram';
import { rate } from './rate/tool';

// export the enum of tool names, so users can use it to check if a tool is available
export enum GeoDaToolNames {
  dataClassify = 'dataClassify',
  lisa = 'lisa',
  globalMoran = 'globalMoran',
  spatialRegression = 'spatialRegression',
  spatialJoin = 'spatialJoin',
  spatialFilter = 'spatialFilter',
  spatialWeights = 'spatialWeights',
  area = 'area',
  buffer = 'buffer',
  centroid = 'centroid',
  dissolve = 'dissolve',
  grid = 'grid',
  length = 'length',
  perimeter = 'perimeter',
  thiessenPolygons = 'thiessenPolygons',
  minimumSpanningTree = 'minimumSpanningTree',
  cartogram = 'cartogram',
  rate = 'rate',
}

const toolRegistry = createToolRegistry({
  dataClassify,
  lisa,
  globalMoran,
  spatialRegression,
  spatialJoin,
  spatialFilter,
  spatialWeights,
  area,
  buffer,
  centroid,
  dissolve,
  grid,
  length,
  perimeter,
  thiessenPolygons,
  minimumSpanningTree,
  cartogram,
  rate,
});

export const tools = toolRegistry.tools;
export const registerTools = toolRegistry.registerTools;

/**
 * Get a single GeoDa tool.
 *
 */
export function getGeoDaTool(
  toolName: string,
  options?: {
    toolContext?: SpatialToolContext;
    onToolCompleted?: OnToolCompleted;
    isExecutable?: boolean;
  }
) {
  return toolRegistry.createTool(toolName, options);
}

export function getGeoDaTools(
  toolContext: SpatialToolContext,
  onToolCompleted: OnToolCompleted,
  isExecutable: boolean = true
) {
  return toolRegistry.createAllTools(toolContext, onToolCompleted, isExecutable);
}
