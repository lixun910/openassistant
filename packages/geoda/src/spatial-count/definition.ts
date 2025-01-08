import {
  RegisterFunctionCallingProps,
  CustomFunctionContext,
} from '@openassistant/core';
import { SpatialJoinGeometries } from 'geoda-wasm';
import { SpatialCountCallbackFunction } from './callback-function';
import { SpatialCountCallbackComponent } from './callback-component';

/**
 * The context for the spatial count function
 * @param getGeometries - the function to get the geometries from the dataset: (datasetName: string) => SpatialJoinGeometries
 * @returns the geometries from the dataset
 */
export type SpatialCountFunctionContext = {
  getGeometries: (datasetName: string) => SpatialJoinGeometries;
  getValues: (datasetName: string, variableName: string) => number[];
  saveAsDataset?: (datasetName: string, data: Record<string, number[]>) => void;
};

type ValueOf<T> = T[keyof T];
export type SpatialCountFunctionContextValues =
  ValueOf<SpatialCountFunctionContext>;

/**
 * The definition of the spatial count function
 * @param context - the context for the spatial count function. See {@link SpatialCountFunctionContext}
 * @returns the definition of the spatial count function
 */
export function spatialCountFunctionDefinition(
  context: CustomFunctionContext<SpatialCountFunctionContextValues>
): RegisterFunctionCallingProps {
  return {
    name: 'spatialCount',
    description:
      'Count the number of geometries from the first dataset in each geometry from the second dataset.',
    properties: {
      firstDatasetName: {
        type: 'string',
        description:
          'The name of the first or right dataset, which will be counted.',
      },
      secondDatasetName: {
        type: 'string',
        description: 'The name of the second or left dataset.',
      },
      joinVariableNames: {
        type: 'array',
        items: {
          type: 'string',
        },
        description:
          'The array of variable names from the first dataset to be joined.',
      },
      joinOperators: {
        type: 'array',
        items: {
          type: 'string',
        },
        description:
          'The array of operator to join each variable. The possible operators are: sum, mean, min, max, median',
      },
    },
    required: ['firstDatasetName', 'secondDatasetName'],
    callbackFunction: SpatialCountCallbackFunction,
    callbackFunctionContext: context,
    callbackMessage: SpatialCountCallbackComponent,
  };
}
