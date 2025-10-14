// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OpenAssistantTool, OpenAssistantExecuteFunctionResult, generateId } from '@openassistant/utils';
import { z } from 'zod';
import { getCentroids, SpatialGeometry } from '@geoda/core';
import { Feature, Geometry } from 'geojson';

import { isSpatialToolContext } from '../utils';
import { SpatialToolContext } from '../types';

export type CentroidFunctionArgs = z.ZodObject<{
  geojson: z.ZodOptional<z.ZodString>;
  datasetName: z.ZodOptional<z.ZodString>;
}>;

export type CentroidLlmResult = {
  success: boolean;
  result: string;
};

export type CentroidAdditionalData = {
  datasetName?: string;
  [outputDatasetName: string]: unknown;
};

/**
 * ## centroid Tool
 * 
 * This tool calculates the centroids (geometric centers) of geometries.
 * Centroids are useful for representing polygon features as points for analysis or visualization.
 *
 * ### Centroid Calculation
 *
 * The tool calculates centroids for various geometry types:
 * - **Polygons**: Calculates the geometric center of polygon areas
 * - **MultiPolygons**: Calculates centroids for each polygon component
 * - **FeatureCollections**: Calculates centroids for all polygon features
 *
 * ### Parameters
 * - `datasetName`: Name of the dataset with geometries to calculate centroids from (optional)
 * - `geojson`: GeoJSON string of geometries to calculate centroids from (optional)
 *
 * **Example user prompts:**
 * - "Can you find the center points of these counties?"
 * - "Calculate centroids for all the polygons"
 * - "Get the center points of the administrative boundaries"
 *
 * ### Example
 * ```typescript
 * import { centroid } from "@openassistant/geoda";
 * import { convertToVercelAiTool } from "@openassistant/utils";
 *
 * const centroidTool = {
 *   ...centroid,
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
 *   prompt: 'Can you find the center points of these counties?',
 *   tools: { centroid: convertToVercelAiTool(centroidTool) },
 * });
 * ```
 */
export const centroid: OpenAssistantTool<
  CentroidFunctionArgs,
  CentroidLlmResult,
  CentroidAdditionalData,
  SpatialToolContext
> = {
  name: 'centroid',
  description: 'Calculate centroids of geometries',
  parameters: z.object({
    geojson: z
      .string()
      .optional()
      .describe(
        'GeoJSON string of the geometry to calculate centroids from. Important: it needs to be wrapped in a FeatureCollection object!'
      ),
    datasetName: z
      .string()
      .optional()
      .describe(
        'Name of the dataset with geometries to calculate centroids from'
      ),
  }),
  execute: async (args: z.infer<CentroidFunctionArgs>, options?: {
    toolCallId: string;
    abortSignal?: AbortSignal;
    context?: SpatialToolContext;
  }): Promise<OpenAssistantExecuteFunctionResult<CentroidLlmResult, CentroidAdditionalData>> => {
    const { datasetName, geojson } = args;
    if (!options?.context || !isSpatialToolContext(options.context)) {
      throw new Error(
        'Context is required and must implement SpatialToolContext'
      );
    }
    const { getGeometries } = options.context;

    let geometries: SpatialGeometry | null = null;

    if (geojson) {
      // in case that LLM can use a simple geojson object like the US State GeoJSON
      const geojsonObject = JSON.parse(geojson);
      geometries = geojsonObject.features;
    } else if (datasetName && getGeometries) {
      geometries = await getGeometries(datasetName);
    }

    if (!geometries) {
      throw new Error('No geometries found');
    }

    const centroids: Array<number[] | null> = await getCentroids(geometries);

    // create a unique id for the centroid result
    const outputDatasetName = `centroid_${generateId()}`;
    const outputGeojson = {
      type: 'FeatureCollection',
      features: centroids
        .filter((centroid) => centroid !== null)
        .map(
          (centroid) =>
            ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: centroid,
              },
              properties: {},
            }) as Feature<Geometry, GeoJSON.GeoJsonProperties>
        ),
    };

    return {
      llmResult: {
        success: true,
        result: `Centroids calculated successfully, and it has been saved in dataset: ${outputDatasetName}`,
      },
      additionalData: {
        datasetName: outputDatasetName,
        [outputDatasetName]: {
          type: 'geojson',
          content: outputGeojson,
        },
      },
    };
  },
  context: {
    getGeometries: async () => null,
  },
};

export type CentroidTool = typeof centroid;
