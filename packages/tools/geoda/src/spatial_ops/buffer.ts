// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  OpenAssistantTool,
  OpenAssistantExecuteFunctionResult,
  generateId,
} from '@openassistant/utils';
import { z } from 'zod';
import { getBuffers } from '@geoda/core';
import { Feature } from 'geojson';

import { isSpatialToolContext } from '../utils';
import { SpatialToolContext } from '../types';

export type BufferFunctionArgs = z.ZodObject<{
  geojson: z.ZodOptional<z.ZodString>;
  datasetName: z.ZodOptional<z.ZodString>;
  distance: z.ZodNumber;
  distanceUnit: z.ZodEnum<['KM', 'Mile']>;
  pointsPerCircle: z.ZodOptional<z.ZodNumber>;
}>;

export type BufferLlmResult = {
  success: boolean;
  result: string;
};

export type BufferAdditionalData = {
  datasetName?: string;
  [outputDatasetName: string]: unknown;
  distance: number;
  distanceUnit: 'KM' | 'Mile';
  pointsPerCircle: number;
};

/**
 * ## buffer Tool
 *
 * This tool creates buffer zones around geometries.
 * It's useful for creating zones of influence, safety perimeters, or proximity analysis around spatial features.
 *
 * ### Buffer Creation
 *
 * The tool supports creating buffers around various geometry types:
 * - **Points**: Creates circular buffers around point locations
 * - **Lines**: Creates buffers along line features (e.g., roads, rivers)
 * - **Polygons**: Creates buffers around polygon boundaries
 *
 * ### Parameters
 * - `datasetName`: Name of the dataset with geometries to be buffered (optional)
 * - `geojson`: GeoJSON string of geometries to be buffered (optional)
 * - `distance`: Buffer distance in the specified unit
 * - `distanceUnit`: Unit for buffer distance - 'KM' for kilometers or 'Mile' for miles
 * - `pointsPerCircle`: Smoothness of the buffer (10 = rough, 20 = smooth)
 *
 * **Example user prompts:**
 * - "Can you create a 5km buffer around these roads?"
 * - "Create a 1-mile buffer around the school locations"
 * - "Generate a 500-meter buffer around the city boundaries"
 *
 * ### Example
 * ```typescript
 * import { buffer } from "@openassistant/geoda";
 * import { convertToVercelAiTool } from "@openassistant/utils";
 *
 * const bufferTool = {
 *   ...buffer,
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
 *   prompt: 'Can you create a 5km buffer around these roads?',
 *   tools: { buffer: convertToVercelAiTool(bufferTool) },
 * });
 * ```
 *
 * :::tip
 * You can also use this tool with other tools, e.g. geocoding, so you don't need to provide the `getGeometries` function.
 * The geometries from geocoding tool will be used as the input for this tool.
 * :::
 */
export const buffer: OpenAssistantTool<
  BufferFunctionArgs,
  BufferLlmResult,
  BufferAdditionalData,
  SpatialToolContext
> = {
  name: 'buffer',
  description:
    'Buffer geometries. Please convert the distance to the unit of the distanceUnit. For example, if user provides distance is 1 meter and the distanceUnit is KM, the distance should be converted to 0.001.',
  parameters: z.object({
    geojson: z
      .string()
      .optional()
      .describe(
        'GeoJSON string of the geometry to be buffered. Important: it needs to be wrapped in a FeatureCollection object!'
      ),
    datasetName: z
      .string()
      .optional()
      .describe('Name of the dataset with geometries to be buffered'),
    distance: z.number(),
    distanceUnit: z.enum(['KM', 'Mile']),
    pointsPerCircle: z
      .number()
      .optional()
      .describe(
        'Smoothness of the buffer: 20 points per circle is smooth, 10 points per circle is rough'
      ),
  }),
  execute: async (
    args: z.infer<BufferFunctionArgs>,
    options?: {
      toolCallId: string;
      abortSignal?: AbortSignal;
      context?: SpatialToolContext;
    }
  ): Promise<
    OpenAssistantExecuteFunctionResult<BufferLlmResult, BufferAdditionalData>
  > => {
    const {
      datasetName,
      geojson,
      distance,
      distanceUnit = 'KM',
      pointsPerCircle = 10,
    } = args;
    if (!options?.context || !isSpatialToolContext(options.context)) {
      throw new Error(
        'Context is required and must implement SpatialToolContext'
      );
    }
    const { getGeometries } = options.context;

    let geometries;

    if (geojson) {
      // in case that LLM can use a simple geojson object like the geocoding result
      const geojsonObject = JSON.parse(geojson);
      geometries = geojsonObject.features;
    } else if (datasetName && getGeometries) {
      geometries = await getGeometries(datasetName);
    } else {
      throw new Error('No geometries found');
    }

    const buffers: Feature[] = await getBuffers({
      geoms: geometries,
      bufferDistance: distance,
      distanceUnit,
      pointsPerCircle,
    });

    // create a unique id for the buffer result
    const outputDatasetName = `buffer_${generateId()}`;

    const outputGeojson = {
      type: 'FeatureCollection',
      // append original properties to the buffer features
      features: buffers.map((feature, index) => ({
        ...feature,
        properties: {
          ...feature.properties,
          ...(geometries[index]?.properties || {}),
        },
      })),
    };

    return {
      llmResult: {
        success: true,
        result: `Buffers created successfully, and it has been saved in dataset: ${outputDatasetName}`,
      },
      additionalData: {
        datasetName: outputDatasetName,
        [outputDatasetName]: {
          type: 'geojson',
          content: outputGeojson,
        },
        distance,
        distanceUnit,
        pointsPerCircle,
      },
    };
  },
  context: {
    getGeometries: async () => null,
  },
};

export type BufferTool = typeof buffer;
