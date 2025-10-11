// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  OpenAssistantTool,
  OpenAssistantExecuteFunctionResult,
} from '@openassistant/utils';
import { z } from 'zod';
import { getArea } from '@geoda/core';
import { SpatialToolContext } from '../types';
import { isSpatialToolContext } from '../utils';

export type AreaFunctionArgs = z.ZodObject<{
  geojson: z.ZodOptional<z.ZodString>;
  datasetName: z.ZodOptional<z.ZodString>;
  distanceUnit: z.ZodDefault<z.ZodEnum<{ KM: 'KM'; Mile: 'Mile' }>>;
}>;

export type AreaLlmResult = {
  success: boolean;
  result: string;
  areas: number[];
  distanceUnit: 'KM' | 'Mile';
};

export type AreaAdditionalData = {
  datasetName?: string;
  geojson?: string;
  distanceUnit: 'KM' | 'Mile';
  areas: number[];
};

/**
 * ## area Tool
 *
 * This tool calculates the area of geometries in a GeoJSON dataset.
 * It supports both direct GeoJSON input and dataset names, and can calculate areas in either square kilometers or square miles.
 *
 * ### Area Calculation
 *
 * The tool calculates the area of various geometry types:
 * - **Polygons**: Calculates the area of polygon geometries
 * - **MultiPolygons**: Calculates the total area of multipolygon geometries
 * - **FeatureCollections**: Calculates areas for all polygon features in the collection
 *
 * ### Parameters
 * - `datasetName`: Name of the dataset with geometries to calculate area for (optional)
 * - `geojson`: GeoJSON string of geometries to calculate area for (optional)
 * - `distanceUnit`: Unit for area calculation - 'KM' for square kilometers or 'Mile' for square miles
 *
 * **Example user prompts:**
 * - "Calculate the area of these counties in square kilometers"
 * - "What is the total area of these land parcels in square miles?"
 * - "Measure the area of these polygons"
 *
 * ### Example
 * ```typescript
 * import { area } from "@openassistant/geoda";
 * import { convertToVercelAiTool } from "@openassistant/utils";
 *
 * const areaTool = {
 *   ...area,
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
 *   prompt: 'Calculate the area of these counties in square kilometers',
 *   tools: { area: convertToVercelAiTool(areaTool) },
 * });
 * ```
 *
 * :::tip
 * You can also use this tool with other tools, e.g. geocoding, so you don't need to provide the `getGeometries` function.
 * The geometries from geocoding tool will be used as the input for this tool.
 * :::
 */
export const area: OpenAssistantTool<
  AreaFunctionArgs,
  AreaLlmResult,
  AreaAdditionalData,
  SpatialToolContext
> = {
  name: 'area',
  description: 'Calculate area of geometries',
  parameters: z.object({
    geojson: z
      .string()
      .optional()
      .describe(
        'GeoJSON string of the geometry to calculate area for. Important: it needs to be wrapped in a FeatureCollection object!'
      ),
    datasetName: z
      .string()
      .optional()
      .describe('Name of the dataset with geometries to calculate area for'),
    distanceUnit: z.enum(['KM', 'Mile']).default('KM'),
  }),
  execute: async (
    args: z.infer<AreaFunctionArgs>,
    options?: {
      toolCallId: string;
      abortSignal?: AbortSignal;
      context?: SpatialToolContext;
    }
  ): Promise<
    OpenAssistantExecuteFunctionResult<AreaLlmResult, AreaAdditionalData>
  > => {
    const { datasetName, geojson, distanceUnit = 'KM' } = args;
    if (!options?.context || !isSpatialToolContext(options.context)) {
      throw new Error(
        'Context is required and must implement SpatialToolContext'
      );
    }
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

    const areas = await getArea(geometries, distanceUnit);

    return {
      llmResult: {
        success: true,
        result: 'Areas calculated successfully',
        areas,
        distanceUnit: distanceUnit as 'KM' | 'Mile',
      },
    };
  },
  context: {
    getGeometries: async () => null,
  },
};

export type AreaTool = typeof area;
