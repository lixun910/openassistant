import {
  RegisterFunctionCallingProps,
  CustomFunctionContext,
} from '@openassistant/core';
import { CreateMapCallbackFunction } from './callback-function';
import { CreateMapCallbackComponent } from './callback-component';

export type GetDatasetForCreateMapFunctionArgs = {
  datasetName: string;
};

export type MapLayerFunctionContext = {
  getDataset: ({ datasetName }: GetDatasetForCreateMapFunctionArgs) => unknown;
};

type ValueOf<T> = T[keyof T];
export type MapLayerFunctionContextValues = ValueOf<MapLayerFunctionContext>;

export function createMapFunctionDefinition(
  context: CustomFunctionContext<MapLayerFunctionContextValues>
): RegisterFunctionCallingProps {
  return {
    name: 'createMap',
    description: 'Create a map with Kepler.gl',
    properties: {
      datasetName: {
        type: 'string',
        description: 'The name of the dataset',
      },
      geometryColumn: {
        type: 'string',
        description: 'The name of the geometry column. (optional)',
      },
      latitudeColumn: {
        type: 'string',
        description: 'The name of the latitude column. (optional)',
      },
      longitudeColumn: {
        type: 'string',
        description: 'The name of the longitude column. (optional)',
      },
      mapType: {
        type: 'string',
        description:
          'The type of the map. e.g. "point", "line", "arc", "polygon", "heatmap", "hexbin", "h3". (optional)',
      },
    },
    required: ['datasetName'],
    callbackFunction: CreateMapCallbackFunction,
    callbackFunctionContext: context,
    callbackMessage: CreateMapCallbackComponent,
  };
}
