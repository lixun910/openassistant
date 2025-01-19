import {
  CallbackFunctionProps,
  CustomFunctionOutputProps,
} from '@openassistant/core';
import { SpatialCountFunctionContext } from './definition';
import { initGeoDa, spatialJoin } from 'geoda-wasm';
import { applyJoin } from './utils/apply-join';

type SpatialCountFunctionArgs = {
  firstDatasetName: string;
  secondDatasetName: string;
  joinVariableNames?: string[];
  joinOperators?: string[];
};

type SpatialCountOutputResult = {
  success: boolean;
  leftDatasetName?: string;
  rightDatasetName?: string;
  details: string;
};

export type SpatialCountOutputData = {
  joinResult: number[][];
  joinValues?: Record<string, number[]>;
  actionButtonLabel?: string;
  actionButtonOnClick?: () => void;
};

// type guard of SpatialCountFunctionArgs
function isSpatialCountFunctionArgs(
  data: unknown
): data is SpatialCountFunctionArgs {
  return (
    typeof data === 'object' &&
    data !== null &&
    'firstDatasetName' in data &&
    'secondDatasetName' in data
  );
}

// type guard of SpatialCountFunctionContext
function isSpatialCountFunctionContext(
  data: unknown
): data is SpatialCountFunctionContext {
  return (
    typeof data === 'object' &&
    data !== null &&
    'getGeometries' in data &&
    'getValues' in data
  );
}

export async function SpatialCountCallbackFunction({
  functionName,
  functionArgs,
  functionContext,
}: CallbackFunctionProps): Promise<
  CustomFunctionOutputProps<SpatialCountOutputResult, SpatialCountOutputData>
> {
  if (!isSpatialCountFunctionArgs(functionArgs)) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Invalid spatial count function arguments.',
      },
    };
  }

  if (!isSpatialCountFunctionContext(functionContext)) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Invalid spatial count function context.',
      },
    };
  }

  const {
    firstDatasetName,
    secondDatasetName,
    joinVariableNames,
    joinOperators,
  } = functionArgs;
  const { getGeometries, getValues, saveAsDataset } = functionContext;

  const firstGeometries = getGeometries(firstDatasetName);
  const secondGeometries = getGeometries(secondDatasetName);

  // initialize GeoDaWasm
  await initGeoDa();

  const result = await spatialJoin({
    leftGeometries: secondGeometries,
    rightGeometries: firstGeometries,
  });

  // get basic statistics of the result
  const basicStatistics = getBasicStatistics(result);

  const joinValues: Record<string, number[]> = {
    Count: result.map((row) => row.length),
  };

  // get the values of the left dataset if joinVariableNames is provided
  if (joinVariableNames && joinOperators) {
    joinVariableNames.forEach((variableName, index) => {
      try {
        const operator = joinOperators[index];
        const values = getValues(firstDatasetName, variableName);
        // apply join to values in each row
        const joinedValues = result.map((row) =>
          applyJoin(
            operator,
            row.map((index) => values[index])
          )
        );
        joinValues[variableName] = joinedValues;
      } catch (error) {
        console.error(
          `Error applying join operator to variable ${variableName}: ${error}`
        );
      }
    });
  }

  return {
    type: 'success',
    name: functionName,
    result: {
      success: true,
      leftDatasetName: firstDatasetName,
      rightDatasetName: secondDatasetName,
      details: `Spatial count function executed successfully. ${JSON.stringify(basicStatistics)}`,
    },
    data: {
      joinResult: result,
      joinValues,
      ...(saveAsDataset
        ? {
            actionButtonLabel: 'Save as dataset',
            actionButtonOnClick: () => {
              saveAsDataset(secondDatasetName, joinValues);
            },
          }
        : {}),
    },
  };
}

/**
 * Get basic statistics of the result
 * @param result - the result of the spatial join
 * @returns - the basic statistics of the result
 */
function getBasicStatistics(result: number[][]) {
  const totalCount = result.length;
  return {
    totalCount,
    minCount: Math.min(...result.map((row) => row.length)),
    maxCount: Math.max(...result.map((row) => row.length)),
    averageCount:
      result.reduce((sum, row) => sum + row.length, 0) / result.length,
  };
}
