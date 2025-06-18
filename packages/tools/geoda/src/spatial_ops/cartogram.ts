import { getCartogram } from '@geoda/core';
import { extendedTool, generateId } from '@openassistant/utils';
import { isSpatialToolContext } from '../utils';
import { z } from 'zod';
import { Feature } from 'geojson';
import { SpatialToolContext } from '../types';

export const cartogram = extendedTool<
  CartogramFunctionArgs,
  CartogramLlmResult,
  CartogramAdditionalData,
  SpatialToolContext
>({
  description:
    'Create a dorling cartogram from a given geometries and a variable',
  parameters: z.object({
    datasetName: z.string(),
    variableName: z.string(),
    iterations: z.number().optional(),
  }),
  execute: async (args, options) => {
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
});

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
