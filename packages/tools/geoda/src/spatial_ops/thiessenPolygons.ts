// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { getThiessenPolygons } from '@geoda/core';
import { OpenAssistantTool, OpenAssistantExecuteFunctionResult, generateId } from '@openassistant/utils';
import { z } from 'zod';

import { SpatialToolContext } from '../types';
import { isSpatialToolContext } from '../utils';

/**
 * ## thiessenPolygons Tool
 * 
 * This tool creates Thiessen polygons (Voronoi diagrams) from a set of points.
 * Thiessen polygons divide space into regions where each point is closer to its associated polygon than to any other point.
 *
 * ### Thiessen Polygons
 *
 * The tool creates Thiessen polygons with the following features:
 * - **Voronoi Diagram**: Divides space into regions based on proximity to input points
 * - **Spatial Partitioning**: Each polygon contains all locations closest to its associated point
 * - **Network Analysis**: Useful for service area analysis and spatial modeling
 * - **Polygon Output**: Returns the Thiessen polygons as polygon features for mapping
 *
 * ### Parameters
 * - `datasetName`: Name of the dataset with point geometries to create Thiessen polygons from (optional)
 * - `geojson`: GeoJSON string of point geometries to create Thiessen polygons from (optional)
 *
 * **Example user prompts:**
 * - "Create Thiessen polygons from these points"
 * - "Generate Voronoi diagram for the facility locations"
 * - "Make service area polygons for these hospitals"
 *
 * ### Example
 * ```typescript
 * import { thiessenPolygons } from "@openassistant/geoda";
 * import { convertToVercelAiTool } from "@openassistant/utils";
 *
 * const thiessenTool = {
 *   ...thiessenPolygons,
 *   context: {
 *     getGeometries: async (datasetName: string) => {
 *       // Implementation to retrieve geometries from your data source
 *       return geometries;
 *     },
 *   },
 * };
 *
 * const result = await generateText({
 *   model: openai('gpt-4.1', { apiKey: key }),
 *   prompt: 'Create Thiessen polygons from these points',
 *   tools: { thiessenPolygons: convertToVercelAiTool(thiessenTool) },
 * });
 * ```
 */
export const thiessenPolygons: OpenAssistantTool<
  ThiessenPolygonsArgs,
  ThiessenPolygonsLlmResult,
  ThiessenPolygonsAdditionalData,
  SpatialToolContext
> = {
  name: 'thiessenPolygons',
  description: 'Generate thiessen polygons or voronoi diagrams',
  parameters: z.object({
    datasetName: z.string().optional(),
    geojson: z
      .string()
      .optional()
      .describe(
        'GeoJSON string of the geometry to calculate area for. Important: it needs to be wrapped in a FeatureCollection object!'
      ),
  }),
  context: {
    getGeometries: async () => null,
  },
  execute: async (args: z.infer<ThiessenPolygonsArgs>, options?: {
    toolCallId: string;
    abortSignal?: AbortSignal;
    context?: SpatialToolContext;
  }): Promise<OpenAssistantExecuteFunctionResult<ThiessenPolygonsLlmResult, ThiessenPolygonsAdditionalData>> => {
    // Check if operation was aborted before starting
    if (options?.abortSignal?.aborted) {
      throw new Error('Thiessen polygons operation was aborted');
    }

    if (!options?.context || !isSpatialToolContext(options.context)) {
      throw new Error(
        'Context is required and must implement SpatialToolContext'
      );
    }

    const { datasetName, geojson } = args;
    const { getGeometries } = options.context;
    let geometries;

    if (geojson) {
      const geojsonObject = JSON.parse(geojson);
      geometries = geojsonObject.features;
    } else if (datasetName && getGeometries) {
      geometries = await getGeometries(datasetName);
    } else {
      throw new Error('No geometries found');
    }

    if (!geometries) {
      throw new Error('No geometries found');
    }

    const thiessenPolygons = await getThiessenPolygons({ geoms: geometries });

    // create a GeoJSON feature collection from the thiessen polygons
    const thiessenPolygonsGeojson = {
      type: 'FeatureCollection',
      features: thiessenPolygons,
    };

    const outputDatasetName = `thiessen_polygons_${generateId()}`;

    return {
      llmResult: {
        success: true,
        result: `Thiessen polygons generated successfully, and it has been saved in dataset: ${outputDatasetName}`,
      },
      additionalData: {
        datasetName: outputDatasetName,
        [outputDatasetName]: {
          type: 'geojson',
          content: thiessenPolygonsGeojson,
        },
      },
    };
  },
};

export type ThiessenPolygonsArgs = z.ZodObject<{
  datasetName: z.ZodOptional<z.ZodString>;
  geojson: z.ZodOptional<z.ZodString>;
}>;

export type ThiessenPolygonsLlmResult = {
  success: boolean;
  result: string;
};

export type ThiessenPolygonsAdditionalData = {
  datasetName: string;
  [key: string]: unknown;
};

export type ThiessenPolygonsTool = typeof thiessenPolygons;
