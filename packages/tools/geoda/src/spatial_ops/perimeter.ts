// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  OpenAssistantTool,
  OpenAssistantExecuteFunctionResult,
} from '@openassistant/utils';
import { z } from 'zod';
import { getPerimeter } from '@geoda/core';
import { SpatialToolContext } from '../types';
import { isSpatialToolContext } from '../utils';

export type PerimeterFunctionArgs = z.ZodObject<{
  geojson: z.ZodOptional<z.ZodString>;
  datasetName: z.ZodOptional<z.ZodString>;
  distanceUnit: z.ZodDefault<z.ZodEnum<['KM', 'Mile']>>;
}>;

export type PerimeterLlmResult = {
  success: boolean;
  result: string;
  perimeters: number[];
  distanceUnit: 'KM' | 'Mile';
};

export type PerimeterAdditionalData = {
  datasetName?: string;
  geojson?: string;
  distanceUnit: 'KM' | 'Mile';
  perimeters: number[];
};

/**
 * ## perimeter Tool
 *
 * This tool calculates the perimeter of geometries in a GeoJSON dataset.
 * It supports both direct GeoJSON input and dataset names, and can calculate perimeters in either kilometers or miles.
 *
 * ### Perimeter Calculation
 *
 * The tool calculates perimeters for various geometry types:
 * - **Polygons**: Calculates the perimeter length of polygon boundaries
 * - **MultiPolygons**: Calculates the total perimeter of multipolygon geometries
 * - **FeatureCollections**: Calculates perimeters for all polygon features in the collection
 *
 * ### Parameters
 * - `datasetName`: Name of the dataset with geometries to calculate perimeter for (optional)
 * - `geojson`: GeoJSON string of geometries to calculate perimeter for (optional)
 * - `distanceUnit`: Unit for perimeter calculation - 'KM' for kilometers or 'Mile' for miles
 *
 * **Example user prompts:**
 * - "Calculate the perimeter of these polygons in kilometers"
 * - "What is the total perimeter of these boundaries in miles?"
 * - "Measure the perimeter of these land parcels"
 *
 * ### Example
 * ```typescript
 * import { perimeter } from "@openassistant/geoda";
 * import { convertToVercelAiTool } from "@openassistant/utils";
 *
 * const perimeterTool = {
 *   ...perimeter,
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
 *   prompt: 'Calculate the perimeter of these polygons in kilometers',
 *   tools: { perimeter: convertToVercelAiTool(perimeterTool) },
 * });
 * ```
 */
export const perimeter: OpenAssistantTool<
  PerimeterFunctionArgs,
  PerimeterLlmResult,
  PerimeterAdditionalData,
  SpatialToolContext
> = {
  name: 'perimeter',
  description: 'Calculate perimeter of geometries',
  parameters: z.object({
    geojson: z
      .string()
      .optional()
      .describe(
        'GeoJSON string of the geometry to calculate perimeter for. Important: it needs to be wrapped in a FeatureCollection object!'
      ),
    datasetName: z
      .string()
      .optional()
      .describe(
        'Name of the dataset with geometries to calculate perimeter for'
      ),
    distanceUnit: z.enum(['KM', 'Mile']).default('KM'),
  }),
  execute: async (
    args: z.infer<PerimeterFunctionArgs>,
    options?: {
      toolCallId: string;
      abortSignal?: AbortSignal;
      context?: SpatialToolContext;
    }
  ): Promise<
    OpenAssistantExecuteFunctionResult<
      PerimeterLlmResult,
      PerimeterAdditionalData
    >
  > => {
    // Check if operation was aborted before starting
    if (options?.abortSignal?.aborted) {
      throw new Error('Perimeter calculation was aborted');
    }

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

    const perimeters = await getPerimeter(geometries, distanceUnit);

    return {
      llmResult: {
        success: true,
        result: 'Perimeters calculated successfully',
        perimeters,
        distanceUnit,
      },
    };
  },
  context: {
    getGeometries: async () => null,
  },
};

export type PerimeterTool = typeof perimeter;
