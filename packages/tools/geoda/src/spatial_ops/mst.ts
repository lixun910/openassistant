// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { getMinimumSpanningTree } from '@geoda/core';
import { OpenAssistantTool, OpenAssistantExecuteFunctionResult, generateId } from '@openassistant/utils';
import { z } from 'zod';

import { SpatialToolContext } from '../types';
import { isSpatialToolContext } from '../utils';

/**
 * ## minimumSpanningTree Tool
 * 
 * This tool creates a minimum spanning tree (MST) from a set of points.
 * An MST connects all points with the minimum total edge length, useful for network analysis and optimization problems.
 *
 * ### Minimum Spanning Tree
 *
 * The tool creates MSTs with the following features:
 * - **Point Connection**: Connects all input points with minimum total distance
 * - **Network Analysis**: Useful for finding optimal connections between locations
 * - **Spatial Optimization**: Minimizes total length while ensuring connectivity
 * - **Line Output**: Returns the MST as line features for mapping
 *
 * ### Parameters
 * - `datasetName`: Name of the dataset with point geometries to create MST from (optional)
 * - `geojson`: GeoJSON string of point geometries to create MST from (optional)
 *
 * **Example user prompts:**
 * - "Create a minimum spanning tree from these points"
 * - "Connect all the cities with the shortest possible roads"
 * - "Generate an MST for the facility locations"
 *
 * ### Example
 * ```typescript
 * import { minimumSpanningTree } from "@openassistant/geoda";
 * import { convertToVercelAiTool } from "@openassistant/utils";
 *
 * const mstTool = {
 *   ...minimumSpanningTree,
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
 *   prompt: 'Create a minimum spanning tree from these points',
 *   tools: { minimumSpanningTree: convertToVercelAiTool(mstTool) },
 * });
 * ```
 *
 * :::note
 * For polygons, the centroids are used to generate the minimum spanning tree.
 * :::
 */
export const minimumSpanningTree: OpenAssistantTool<
  MinimumSpanningTreeArgs,
  MinimumSpanningTreeLlmResult,
  MinimumSpanningTreeAdditionalData,
  SpatialToolContext
> = {
  name: 'minimumSpanningTree',
  description: 'Generate the minimum spanning tree',
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
  execute: async (args: z.infer<MinimumSpanningTreeArgs>, options?: {
    toolCallId: string;
    abortSignal?: AbortSignal;
    context?: SpatialToolContext;
  }): Promise<OpenAssistantExecuteFunctionResult<MinimumSpanningTreeLlmResult, MinimumSpanningTreeAdditionalData>> => {
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

    const mst = await getMinimumSpanningTree({
      geoms: geometries,
    });

    // create a GeoJSON feature collection from the minimum spanning tree
    const mstGeojson = {
      type: 'FeatureCollection',
      features: mst,
    };

    const outputDatasetName = `mst_${generateId()}`;

    return {
      llmResult: {
        success: true,
        result: `Minimum spanning tree generated successfully, and it has been saved in dataset: ${outputDatasetName}`,
      },
      additionalData: {
        datasetName: outputDatasetName,
        [outputDatasetName]: {
          type: 'geojson',
          content: mstGeojson,
        },
      },
    };
  },
};

export type MinimumSpanningTreeArgs = z.ZodObject<{
  datasetName: z.ZodOptional<z.ZodString>;
  geojson: z.ZodOptional<z.ZodString>;
}>;

export type MinimumSpanningTreeLlmResult = {
  success: boolean;
  result: string;
};

export type MinimumSpanningTreeAdditionalData = {
  datasetName: string;
  [key: string]: unknown;
};

export type MinimumSpanningTreeTool = typeof minimumSpanningTree;
