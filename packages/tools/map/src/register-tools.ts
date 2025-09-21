// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OnToolCompleted } from '@openassistant/utils';
import { createToolRegistry } from '@openassistant/tools-shared';

import { keplergl } from './keplergl/tool';
import { leaflet } from './leaflet/tool';
import { GetDataset, GetGeometries } from './types';
import { downloadMapData } from './data/tool';

export enum MapToolNames {
  keplergl = 'keplergl',
  leaflet = 'leaflet',
  downloadMapData = 'downloadMapData',
}

const toolRegistry = createToolRegistry({
  [MapToolNames.keplergl]: keplergl,
  [MapToolNames.leaflet]: leaflet,
  [MapToolNames.downloadMapData]: downloadMapData,
});

export const tools = toolRegistry.tools;
export const registerTools = toolRegistry.registerTools;

export type MapToolContext = {
  getDataset?: GetDataset;
  getGeometries?: GetGeometries;
  config?: { isDraggable?: boolean; theme?: string };
};

export function isMapToolContext(context: unknown): context is MapToolContext {
  return typeof context === 'object' && context !== null;
}

/**
 * Get a map tool (client-side tool)
 *
 * :::note
 * This tool is executed in the browser. You can use it to create a map in the browser.
 * :::
 *
 * To create a map, this tool will get the dataset or geometries from the tool context.
 * You will need to provide the tool context to the tool.
 *
 * @example
 * ```typescript
 * import { getMapTool, MapToolNames } from '@openassistant/map';
 *
 * const keplerglTool = getMapTool(MapToolNames.keplergl, {
 *   toolContext: {
 *     getDataset: async (datasetName: string) => {
 *       // get the dataset for mapping, e.g. geojson dataset, csv, geoarrow etc.
 *       return {
 *           type: 'FeatureCollection',
 *           features: [
 *             {
 *               type: 'Feature',
 *               geometry: {
 *                 type: 'Point',
 *                 coordinates: [102.0, 0.5],
 *               },
 *             },
 *           ],
 *         };
 *     },
 *   },
 * });
 *
 * streamText({
 *   model: openai('gpt-4o'),
 *   prompt: 'Create a map of the dataset XYZ',
 *   tools: {
 *     keplergl: keplerglTool,
 *   },
 * });
 * ```
 *
 * You can also pass geometries that are genereted from other tools e.g. isochrone or routing.
 *
 * @example
 * ```typescript
 * import { getOsmTool, OsmToolNames } from '@openassistant/osm';
 * import { getMapTool, MapToolNames } from '@openassistant/map';
 *
 * const dataCache = {};
 *
 * const geocodingTool = getOsmTool(OsmToolNames.geocoding);
 *
 * const isochroneTool = getOsmTool(OsmToolNames.isochrone, {
 *   toolContext: {
 *     getMapboxToken: async () => {
 *       return process.env.MAPBOX_TOKEN;
 *     },
 *   },
 *   onToolCompleted: (toolCallId, additionalData) => {
 *     const {cacheId, isochrone} = additionalData;
 *     if (cacheId && isochrone) {
 *       dataCache[cacheId] = isochrone;
 *     }
 *   },
 * });
 *
 * const keplerglTool = getMapTool(MapToolNames.keplergl, {
 *   toolContext: {
 *     getGeometries: async (datasetName: string) => {
 *       if (dataCache[datasetName]) {
 *         return dataCache[datasetName];
 *       }
 *       throw new Error(`geometries of ${datasetName} not found`);
 *     },
 *   },
 * });
 *
 * streamText({
 *   model: openai('gpt-4o'),
 *   prompt: 'Create a map of 5 minutes isochrone of the Eiffel Tower',
 *   tools: {
 *     geocoding: geocodingTool,
 *     isochrone: isochroneTool,
 *     keplergl: keplerglTool,
 *   },
 * });
 * ```
 *
 * @param toolName - The name of the tool to get
 * @param options - The options for the tool
 * @returns The tool
 */
export function getMapTool(
  toolName: string,
  options: {
    toolContext: MapToolContext;
    onToolCompleted?: OnToolCompleted;
    isExecutable?: boolean;
  }
) {
  return toolRegistry.createTool(toolName, options);
}

/**
 * Get all keplergl tools.
 *
 * @param toolContext - The tool context, which is required for some tools e.g. routing, isochrone, etc.
 * @param onToolCompleted - The callback function to handle the tool completion and get the output data from the tool call
 * @param isExecutable - Whether the tool is executable e.g. on the server side, default to true. If false, you need to execute the tool on the client side.
 * @returns The tools
 */
export function getMapTools(
  toolContext: MapToolContext,
  onToolCompleted: OnToolCompleted,
  isExecutable: boolean = true
) {
  return toolRegistry.createAllTools(toolContext, onToolCompleted, isExecutable);
}
