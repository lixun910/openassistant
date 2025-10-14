// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  OpenAssistantTool,
  OpenAssistantExecuteFunctionResult,
  generateId,
} from '@openassistant/utils';
import { z } from 'zod';
import { spatialDissolve } from '@geoda/core';
import { Feature } from 'geojson';

import { isSpatialToolContext } from '../utils';
import { SpatialToolContext } from '../types';
import { applyJoin } from '../spatial_join/apply-join';

export type DissolveFunctionArgs = z.ZodObject<{
  geojson: z.ZodOptional<z.ZodString>;
  datasetName: z.ZodOptional<z.ZodString>;
  dissolveBy: z.ZodOptional<z.ZodString>;
  aggregateVariables: z.ZodOptional<
    z.ZodArray<
      z.ZodObject<{
        variableName: z.ZodString;
        operator: z.ZodEnum<['sum', 'mean', 'min', 'max', 'median', 'count', 'unique']>;
      }>
    >
  >;
}>;

export type DissolveLlmResult = {
  success: boolean;
  result: string;
};

export type DissolveAdditionalData = {
  datasetName?: string;
  [outputDatasetName: string]: unknown;
};

/**
 * ## dissolve Tool
 *
 * This tool merges multiple geometries into a single geometry by dissolving boundaries.
 * It's useful for aggregating smaller administrative units into larger regions or creating simplified boundaries.
 *
 * ### Dissolve Operations
 *
 * The tool supports various dissolve operations:
 * - **Complete Dissolve**: Merges all geometries into a single geometry
 * - **Dissolve by Attribute**: Groups geometries by a common attribute value
 * - **Aggregated Dissolve**: Combines geometries and aggregates associated values
 *
 * ### Parameters
 * - `datasetName`: Name of the dataset with geometries to be dissolved (optional)
 * - `geojson`: GeoJSON string of geometries to be dissolved (optional)
 * - `dissolveBy`: Variable to dissolve by (optional, dissolves entire dataset if not provided)
 * - `aggregateVariables`: Variables to aggregate during dissolve with their operators (optional)
 *
 * **Example user prompts:**
 * - "Can you merge these counties into a single region?"
 * - "Dissolve the census tracts by state and sum the population"
 * - "Combine all the polygons into one geometry"
 *
 * ### Example
 * ```typescript
 * import { dissolve } from "@openassistant/geoda";
 * import { convertToVercelAiTool } from "@openassistant/utils";
 *
 * const dissolveTool = {
 *   ...dissolve,
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
 *   prompt: 'Can you merge these counties into a single region?',
 *   tools: { dissolve: convertToVercelAiTool(dissolveTool) },
 * });
 * ```
 */
export const dissolve: OpenAssistantTool<
  DissolveFunctionArgs,
  DissolveLlmResult,
  DissolveAdditionalData,
  SpatialToolContext
> = {
  name: 'dissolve',
  description: `Dissolve geometries by merging neighboring geometries into a single geometry.`,
  parameters: z.object({
    geojson: z
      .string()
      .optional()
      .describe(
        'GeoJSON string of the geometry to be dissolved. Important: it needs to be wrapped in a FeatureCollection object!'
      ),
    datasetName: z
      .string()
      .optional()
      .describe('Name of the dataset with geometries to be dissolved'),
    dissolveBy: z.string().optional().describe(`The variable to dissolve by.
For example, when dissolving a county dataset into a state dataset, the dissolveBy could be the state name or the state code.
If not provided, the entire dataset will be dissolved.
`),
    aggregateVariables: z
      .array(
        z.object({
          variableName: z.string(),
          operator: z.enum([
            'sum',
            'mean',
            'min',
            'max',
            'median',
            'count',
            'unique',
          ]),
        })
      )
      .optional(),
  }),
  execute: async (
    args: z.infer<DissolveFunctionArgs>,
    options?: {
      toolCallId: string;
      abortSignal?: AbortSignal;
      context?: SpatialToolContext;
    }
  ): Promise<
    OpenAssistantExecuteFunctionResult<
      DissolveLlmResult,
      DissolveAdditionalData
    >
  > => {
    const { datasetName, geojson, dissolveBy, aggregateVariables } = args;
    if (!options?.context || !isSpatialToolContext(options.context)) {
      throw new Error(
        'Context is required and must implement SpatialToolContext'
      );
    }
    const { getGeometries, getValues } = options.context;

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

    const dissolvedPolygons: Feature[] = [];
    const dissolvedGroups: number[][] = [];

    // dissolve the geometries by the dissolveBy variable
    if (dissolveBy && datasetName && getValues) {
      // get the values of the dissolveBy variable
      const dissolveByValues = await getValues(datasetName, dissolveBy);
      // find unique values of dissolveBy values
      const uniqueDissolveByValues = [...new Set(dissolveByValues)];
      // dissolve the geometries by the unique dissolveBy values
      for (const value of uniqueDissolveByValues) {
        const ids: number[] = [];
        const dissolvedGroup = geometries.filter((geometry, index) => {
          if (geometry.properties[dissolveBy] === value) {
            ids.push(index);
          }
          return geometry.properties[dissolveBy] === value;
        });
        const dissolvedPolygon = await spatialDissolve(dissolvedGroup);
        dissolvedPolygons.push(dissolvedPolygon);
        dissolvedGroups.push(ids);
      }
    } else {
      // dissolve the geometries by the entire dataset
      const dissolvedPolygon = await spatialDissolve(geometries);
      dissolvedPolygons.push(dissolvedPolygon);
      // get all ids
      const ids = geometries.map((_, index) => index);
      dissolvedGroups.push(ids);
    }

    // try to apply dissolveVariableOperators to the dissolved groups
    const joinValues: Record<string, (number | string)[]> = {};

    if (datasetName && aggregateVariables && getValues) {
      await Promise.all(
        aggregateVariables.map(async ({ variableName, operator }) => {
          const values = await getValues(datasetName, variableName);
          try {
            const joinedValues = dissolvedGroups.map((group) => {
              return applyJoin(
                operator,
                group.map((index) => values[index]) as number[]
              );
            });
            joinValues[variableName] = joinedValues;
          } catch (error) {
            throw new Error(
              `Error applying join operator to variable ${variableName}: ${error}`
            );
          }
        })
      );
      // add joinValues to the dissolvedPolygons in properties
      dissolvedPolygons.forEach((polygon, index) => {
        polygon.properties = {
          ...polygon.properties,
          // add joinValues to the dissolvedPolygons in properties
          ...Object.fromEntries(
            Object.entries(joinValues).map(([key, value]) => [
              key,
              value[index],
            ])
          ),
        };
      });
    }

    // create a unique id for the dissolve result
    const outputDatasetName = `dissolve_${generateId()}`;
    const outputGeojson = {
      type: 'FeatureCollection',
      features: dissolvedPolygons,
    };

    return {
      llmResult: {
        success: true,
        result: `Geometries dissolved successfully, and it has been saved in dataset: ${outputDatasetName}`,
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

export type DissolveTool = typeof dissolve;
