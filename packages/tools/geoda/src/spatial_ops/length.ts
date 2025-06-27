import { extendedTool } from '@openassistant/utils';
import { z } from 'zod';
import { getLength } from '@geoda/core';
import { isSpatialToolContext } from '../utils';

export type LengthFunctionArgs = z.ZodObject<{
  geojson: z.ZodOptional<z.ZodString>;
  datasetName: z.ZodOptional<z.ZodString>;
  distanceUnit: z.ZodEnum<['KM', 'Mile']>;
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
 *
 * ### Length Calculation
 *
 * It supports both direct GeoJSON input and dataset names, and can calculate
 * lengths in either kilometers or miles.
 *
 * Example user prompts:
 * - "Calculate the length of these roads in kilometers"
 * - "What is the total length of the river network in miles?"
 * - "Measure the length of these boundaries"
 *
 * Example code:
 * ```typescript
 * import { length, LengthTool } from '@openassistant/geoda';
 * import { convertToVercelAiTool } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * const lengthTool: LengthTool = {
 *   ...length,
 *   context: {
 *     getGeometries: (datasetName) => {
 *       return SAMPLE_DATASETS[datasetName].map((item) => item.geometry);
 *     },
 *   },
 * });
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Calculate the length of these roads in kilometers',
 *   tools: {length: convertToVercelAiTool(lengthTool)},
 * });
 * ```
 */
export const length = extendedTool({
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
  execute: async (args, options) => {
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
    getGeometries: () => {},
  },
});
