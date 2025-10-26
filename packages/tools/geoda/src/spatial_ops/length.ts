// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  OpenAssistantTool,
  OpenAssistantExecuteFunctionResult,
} from '@openassistant/utils';
import { z } from 'zod';
import { getLength } from '@geoda/core';
import { isSpatialToolContext } from '../utils';
import { SpatialToolContext } from '../types';

export type LengthFunctionArgs = z.ZodObject<{
  geojson: z.ZodOptional<z.ZodString>;
  datasetName: z.ZodOptional<z.ZodString>;
  distanceUnit: z.ZodDefault<z.ZodEnum<['KM', 'Mile']>>;
}>;

export type LengthLlmResult = {
  success: boolean;
  result: string;
  lengths: number[];
  distanceUnit: 'KM' | 'Mile';
};

export type LengthAdditionalData = {
  datasetName?: string;
  geojson?: string;
  lengths: number[];
  distanceUnit: 'KM' | 'Mile';
};

/**
 * ## length Tool
 *
 * This tool calculates the length of geometries in a GeoJSON dataset.
 * It supports both direct GeoJSON input and dataset names, and can calculate lengths in either kilometers or miles.
 *
 * ### Length Calculation
 *
 * The tool calculates lengths for various geometry types:
 * - **LineStrings**: Calculates the total length of line features
 * - **MultiLineStrings**: Calculates the total length of multiline features
 * - **Polygons**: Calculates the perimeter length of polygon boundaries
 * - **FeatureCollections**: Calculates lengths for all line features in the collection
 *
 * ### Parameters
 * - `datasetName`: Name of the dataset with geometries to calculate length for (optional)
 * - `geojson`: GeoJSON string of geometries to calculate length for (optional)
 * - `distanceUnit`: Unit for length calculation - 'KM' for kilometers or 'Mile' for miles
 *
 * **Example user prompts:**
 * - "Calculate the length of these roads in kilometers"
 * - "What is the total length of the river network in miles?"
 * - "Measure the length of these boundaries"
 *
 * ### Example
 * ```typescript
 * import { length } from "@openassistant/geoda";
 * import { convertToVercelAiTool } from "@openassistant/utils";
 *
 * const lengthTool = {
 *   ...length,
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
 *   prompt: 'Calculate the length of these roads in kilometers',
 *   tools: { length: convertToVercelAiTool(lengthTool) },
 * });
 * ```
 */
export const length: OpenAssistantTool<
  LengthFunctionArgs,
  LengthLlmResult,
  LengthAdditionalData,
  SpatialToolContext
> = {
  name: 'length',
  description: 'Calculate length of geometries',
  parameters: z.object({
    geojson: z
      .string()
      .optional()
      .describe(
        'GeoJSON string of the geometry to calculate length for. Important: it needs to be wrapped in a FeatureCollection object!'
      ),
    datasetName: z
      .string()
      .optional()
      .describe('Name of the dataset with geometries to calculate length for'),
    distanceUnit: z.enum(['KM', 'Mile']).default('KM'),
  }),
  execute: async (
    args: z.infer<LengthFunctionArgs>,
    options?: {
      toolCallId: string;
      abortSignal?: AbortSignal;
      context?: SpatialToolContext;
    }
  ): Promise<
    OpenAssistantExecuteFunctionResult<LengthLlmResult, LengthAdditionalData>
  > => {
    // Check if operation was aborted before starting
    if (options?.abortSignal?.aborted) {
      throw new Error('Length calculation was aborted');
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
    }

    if (!geometries) {
      throw new Error('No geometries found');
    }

    const lengths = await getLength(geometries, distanceUnit);

    return {
      llmResult: {
        success: true,
        result: 'Lengths calculated successfully',
        lengths,
        distanceUnit,
      },
    };
  },
  context: {
    getGeometries: () => {
      throw new Error('getGeometries() of LengthTool is not implemented');
    },
  },
};
