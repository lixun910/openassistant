// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { getCartogram } from '@geoda/core';
import { OpenAssistantTool, OpenAssistantExecuteFunctionResult, generateId } from '@openassistant/utils';
import { isSpatialToolContext } from '../utils';
import { z } from 'zod';
import { Feature } from 'geojson';
import { SpatialToolContext } from '../types';

/**
 * ## cartogram Tool
 * 
 * This tool creates a Dorling cartogram from given geometries and a variable.
 * A cartogram is a map where the size of geographic units is proportional to a variable value rather than their actual geographic area.
 *
 * ### Cartogram Creation
 *
 * A cartogram replaces the original layout of areal units with geometric forms (usually circles) that are proportional to the variable value.
 * This is useful for visualizing data where geographic size doesn't reflect the importance of the data.
 *
 * ### Parameters
 * - `datasetName`: Name of the dataset containing the geometries and variable
 * - `variableName`: Name of the variable to use for sizing the cartogram elements
 * - `iterations`: Number of iterations for cartogram optimization (default: 100)
 *
 * **Example user prompts:**
 * - "Create a Dorling cartogram from the geometries and the variable 'population'"
 * - "Generate a cartogram showing GDP by country"
 * - "Make a cartogram of election results by state"
 *
 * ### Example
 * ```typescript
 * import { cartogram } from "@openassistant/geoda";
 * import { convertToVercelAiTool } from "@openassistant/utils";
 *
 * const cartogramTool = {
 *   ...cartogram,
 *   context: {
 *     getGeometries: async (datasetName: string) => {
 *       // Implementation to retrieve geometries from your data source
 *       return geometries;
 *     },
 *     getValues: async (datasetName: string, variableName: string) => {
 *       // Implementation to retrieve values from your data source
 *       return [100, 200, 150, 300, 250];
 *     },
 *   },
 * };
 *
 * const result = await generateText({
 *   model: openai('gpt-4.1', { apiKey: key }),
 *   prompt: 'Create a Dorling cartogram from the geometries and the variable "population"',
 *   tools: { cartogram: convertToVercelAiTool(cartogramTool) },
 * });
 * ```
 */
export const cartogram: OpenAssistantTool<
  CartogramFunctionArgs,
  CartogramLlmResult,
  CartogramAdditionalData,
  SpatialToolContext
> = {
  name: 'cartogram',
  description:
    'Create a dorling cartogram from a given geometries and a variable',
  parameters: z.object({
    datasetName: z.string(),
    variableName: z.string(),
    iterations: z.number().optional(),
  }),
  execute: async (args: z.infer<CartogramFunctionArgs>, options?: {
    toolCallId: string;
    abortSignal?: AbortSignal;
    context?: SpatialToolContext;
  }): Promise<OpenAssistantExecuteFunctionResult<CartogramLlmResult, CartogramAdditionalData>> => {
    // Check if operation was aborted before starting
    if (options?.abortSignal?.aborted) {
      throw new Error('Cartogram operation was aborted');
    }

    const { datasetName, variableName, iterations } = args;
    if (!options?.context || !isSpatialToolContext(options.context)) {
      throw new Error(
        'Context is required and must implement SpatialToolContext'
      );
    }
    const { getGeometries, getValues } = options.context;

    let geometries;
    if (datasetName && getGeometries) {
      geometries = await getGeometries(datasetName);
    } else {
      throw new Error('No geometries found');
    }

    let values: number[] = [];
    if (datasetName && variableName && getValues) {
      values = (await getValues(datasetName, variableName)) as number[];
    } else {
      throw new Error('No values found');
    }

    const cartogram: Feature[] = await getCartogram(
      geometries,
      values,
      iterations || 100
    );

    // create a unique id for the cartogram result
    const outputDatasetName = `cartogram_${generateId()}`;

    const outputGeojson = {
      type: 'FeatureCollection',
      // append the values to the cartogram features
      features: cartogram.map((feature, index) => ({
        ...feature,
        properties: {
          ...feature.properties,
          [variableName]: values[index],
        },
      })),
    };

    return {
      llmResult: {
        success: true,
        result: `Cartogram created successfully, and it has been saved in dataset: ${outputDatasetName}`,
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
    getValues: async () => [],
  },
};

export type CartogramFunctionArgs = z.ZodObject<{
  datasetName: z.ZodString;
  variableName: z.ZodString;
  iterations: z.ZodOptional<z.ZodNumber>;
}>;

export type CartogramLlmResult = {
  success: boolean;
  result: string;
};

export type CartogramAdditionalData = {
  datasetName?: string;
  [outputDatasetName: string]: unknown;
};

export type CartogramTool = typeof cartogram;
