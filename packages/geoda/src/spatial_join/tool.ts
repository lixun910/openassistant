import { tool } from '@openassistant/core';
import {
  CheckGeometryType,
  SpatialGeometry,
  spatialJoin as spatialJoinFunc,
  SpatialJoinGeometryType,
} from '@geoda/core';
import { z } from 'zod';
import { binaryToGeojson } from '@loaders.gl/gis';

import { applyJoin } from './apply-join';
import { SpatialJoinToolComponent } from './component/spatial-count-component';
import { GetValues, GetGeometries } from '../types';
import { cacheData, generateId, getGeoDaCachedData } from '../utils';

export const spatialJoin = tool<
  // parameters of the tool
  z.ZodObject<{
    firstDatasetName: z.ZodString;
    secondDatasetName: z.ZodString;
    joinVariableNames: z.ZodArray<z.ZodString>;
    joinOperators: z.ZodArray<
      z.ZodEnum<['sum', 'mean', 'min', 'max', 'median', 'count']>
    >;
  }>,
  // return type of the tool
  ExecuteSpatialJoinResult['llmResult'],
  // additional data of the tool
  ExecuteSpatialJoinResult['additionalData'],
  // type of the context
  SpatialCountFunctionContext
>({
  description: `Spatial join geometries from the first dataset with geometries from the second dataset.
For example, if you want to get the number of people in each county,the first dataset should contains the number of people and the second dataset should contains the counties.`,
  parameters: z.object({
    firstDatasetName: z.string(),
    secondDatasetName: z.string(),
    joinVariableNames: z
      .array(z.string())
      .describe(
        'The array of variable names from the first dataset to be joined.'
      ),
    joinOperators: z.array(
      z.enum(['sum', 'mean', 'min', 'max', 'median', 'count'])
    ),
  }),
  execute: executeSpatialJoin,
  context: {
    getGeometries: () => {
      throw new Error('getGeometries() of SpatialJoinTool is not implemented');
    },
    getValues: () => {
      throw new Error('getValues() of SpatialJoinTool is not implemented');
    },
    saveAsDataset: () => {
      throw new Error('saveAsDataset() of SpatialJoinTool is not implemented');
    },
  },
  component: SpatialJoinToolComponent,
});

export type SpatialJoinTool = typeof spatialJoin;

/**
 * The context for the spatial count function
 * @param getGeometries - the function to get the geometries from the dataset: (datasetName: string) => SpatialJoinGeometries
 * @returns the geometries from the dataset
 */
export type SpatialCountFunctionContext = {
  getGeometries: GetGeometries;
  getValues?: GetValues;
  saveAsDataset?: (datasetName: string, data: Record<string, number[]>) => void;
};

export type ExecuteSpatialJoinResult = {
  llmResult: {
    success: boolean;
    result?: {
      firstDatasetName: string;
      secondDatasetName: string;
      joinVariableNames?: string[];
      joinOperators?: string[];
      firstTenRows?: number[][];
      details: string;
    };
    error?: string;
  };
  additionalData?: {
    firstDatasetName: string;
    secondDatasetName: string;
    joinVariableNames?: string[];
    joinOperators?: string[];
    joinResult: number[][];
    joinValues: Record<string, number[]>;
  };
};

type SpatialJoinArgs = {
  firstDatasetName: string;
  secondDatasetName: string;
  joinVariableNames: string[];
  joinOperators: string[];
};

function isSpatialJoinArgs(args: unknown): args is SpatialJoinArgs {
  return (
    typeof args === 'object' &&
    args !== null &&
    'firstDatasetName' in args &&
    'secondDatasetName' in args &&
    typeof args.firstDatasetName === 'string' &&
    typeof args.secondDatasetName === 'string'
  );
}

function isSpatialJoinContext(
  context: unknown
): context is SpatialCountFunctionContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getGeometries' in context &&
    typeof context.getGeometries === 'function'
  );
}

async function executeSpatialJoin(
  args,
  options
): Promise<ExecuteSpatialJoinResult> {
  if (!isSpatialJoinArgs(args)) {
    throw new Error('Invalid arguments for spatialJoin tool');
  }

  if (options.context && !isSpatialJoinContext(options.context)) {
    throw new Error('Invalid context for spatialJoin tool');
  }

  const {
    firstDatasetName,
    secondDatasetName,
    joinVariableNames,
    joinOperators,
  } = args;
  const { getGeometries, getValues } = options.context;

  return runSpatialJoin({
    firstDatasetName,
    secondDatasetName,
    previousExecutionOutput: options.previousExecutionOutput,
    joinVariableNames,
    joinOperators,
    getGeometries,
    getValues,
  });
}

export async function runSpatialJoin({
  firstDatasetName,
  secondDatasetName,
  joinVariableNames,
  joinOperators,
  getGeometries,
  getValues,
}: {
  firstDatasetName: string;
  secondDatasetName: string;
  previousExecutionOutput?: {
    data?: {
      geojson?: GeoJSON.FeatureCollection;
    };
  };
  joinVariableNames?: string[];
  joinOperators?: string[];
  getGeometries: GetGeometries;
  getValues: GetValues;
}) {
  try {
    // Get geometries from both datasets
    let firstGeometries = await getGeometries(firstDatasetName);
    let secondGeometries = await getGeometries(secondDatasetName);

    if (!firstGeometries || firstGeometries.length === 0) {
      const cacheData = await getGeoDaCachedData(firstDatasetName);
      if (cacheData) {
        firstGeometries = (cacheData as GeoJSON.FeatureCollection).features;
      } else {
        throw new Error('First dataset geometries not found');
      }
    }

    if (!secondGeometries || secondGeometries.length === 0) {
      const cacheData = await getGeoDaCachedData(secondDatasetName);
      if (cacheData) {
        secondGeometries = (cacheData as GeoJSON.FeatureCollection).features;
      } else {
        throw new Error('Second dataset geometries not found');
      }
    }

    const result = await spatialJoinFunc({
      leftGeometries: secondGeometries,
      rightGeometries: firstGeometries,
    });

    // get basic statistics of the result for LLM
    const basicStatistics = getBasicStatistics(result);

    const joinValues: Record<string, number[]> = {
      Count: result.map((row) => row.length),
    };

    // get the values of the left dataset if joinVariableNames is provided
    if (joinVariableNames && joinOperators) {
      await Promise.all(
        joinVariableNames.map(async (variableName, index) => {
          try {
            const operator = joinOperators[index];
            const values = await getValues(firstDatasetName, variableName);
            // apply join to values in each row
            const joinedValues = result.map((row) =>
              applyJoin(
                operator,
                row.map((index) => values[index])
              )
            );
            joinValues[variableName] = joinedValues;
          } catch (error) {
            throw new Error(
              `Error applying join operator to variable ${variableName}: ${error}`
            );
          }
        })
      );
    }

    // append joinValues to the left geometries
    const leftGeometriesWithJoinValues = appendJoinValuesToGeometries(
      secondGeometries,
      joinValues
    );

    // cache the joined dataset
    const joinedDatasetId = generateId();
    cacheData(joinedDatasetId, leftGeometriesWithJoinValues);

    // joinValues is a record of variable names and their values
    // return the first 10 rows of each variable, including the variable name
    const columns = Object.keys(joinValues);
    const firstTwoRows = columns.map((column) => ({
      [column]: joinValues[column].slice(0, 2),
    }));

    return {
      llmResult: {
        success: true,
        result: {
          firstDatasetName,
          secondDatasetName,
          joinVariableNames,
          joinOperators,
          firstTwoRows,
          joinedDatasetId,
          details: `Spatial count function executed successfully and the joined dataset is saved in DatasetName: ${joinedDatasetId}. ${JSON.stringify(basicStatistics)}`,
        },
      },
      additionalData: {
        firstDatasetName,
        secondDatasetName,
        joinVariableNames,
        joinOperators,
        joinResult: result,
        joinValues,
        joinedDatasetId: joinedDatasetId,
        joinedDataset: leftGeometriesWithJoinValues,
      },
    };
  } catch (error) {
    return {
      llmResult: {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
    };
  }
}

/**
 * Get basic statistics of the result
 * @param result - the result of the spatial join
 * @returns - the basic statistics of the result
 */
export function getBasicStatistics(result: number[][]) {
  const totalCount = result.length;
  return {
    totalCount,
    minCount: Math.min(...result.map((row) => row.length)),
    maxCount: Math.max(...result.map((row) => row.length)),
    averageCount:
      result.reduce((sum, row) => sum + row.length, 0) / result.length,
  };
}

function appendJoinValuesToGeometries(
  geometries: SpatialGeometry,
  joinValues: Record<string, number[]>
): GeoJSON.FeatureCollection | unknown[] {
  const geometryType = CheckGeometryType(geometries);
  const variableNames = Object.keys(joinValues);

  switch (geometryType) {
    case SpatialJoinGeometryType.BinaryFeatureCollection: {
      // convert binary to geojson and flatten the results
      const features: GeoJSON.Feature[] = geometries.flatMap((binary) => {
        const result = binaryToGeojson(binary);
        return Array.isArray(result) ? result : [result];
      });
      // create a geojson feature collection and append joinValues to the features
      const featureCollection: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: features.map((feature, index) => ({
          ...feature,
          properties: {
            ...feature.properties,
            ...Object.fromEntries(
              variableNames.map((name) => [name, joinValues[name][index]])
            ),
          },
        })),
      };
      return featureCollection;
    }
    case SpatialJoinGeometryType.GeoJsonFeature: {
      // append joinValues to the properties of the features
      const featuresWithJoinValues = geometries.map((feature, index) => ({
        ...feature,
        properties: {
          ...feature.properties,
          ...Object.fromEntries(
            variableNames.map((name) => [name, joinValues[name][index]])
          ),
        },
      }));
      return {
        type: 'FeatureCollection',
        features: featuresWithJoinValues,
      };
    }
    case SpatialJoinGeometryType.ArcLayerData: {
      // return a csv style array of features with joinValues
      const featuresWithJoinValues = geometries.map((feature, index) => [
        ...feature,
        ...variableNames.map((name) => joinValues[name][index]),
      ]);
      // append the variable names to the first row
      featuresWithJoinValues.unshift(['geometry', ...variableNames]);
      return featuresWithJoinValues;
    }
    case SpatialJoinGeometryType.PointLayerData: {
      // return a csv style array of features with joinValues
      const featuresWithJoinValues = geometries.map((feature, index) => [
        ...feature,
        ...variableNames.map((name) => joinValues[name][index]),
      ]);
      // append the variable names to the first row
      featuresWithJoinValues.unshift(['geometry', ...variableNames]);
      return featuresWithJoinValues;
    }
    default:
      throw new Error('Unsupported geometry type');
  }
}
