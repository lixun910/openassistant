import { OpenAssistantTool } from '@openassistant/utils';
import {
  cellToChildren,
  getResolution,
  latLngToCell,
  polygonToCells,
} from 'h3-js';
import z from 'zod';
import { FeatureCollection } from 'geojson';

// Context type for H3 tools that need geometry data
export type H3ToolContext = {
  getGeometries: (datasetName: string) => Promise<FeatureCollection[]>;
};

// Schema strictly guarding the allowed parameters for the h3Cell tool
const h3CellParameters = z
  .object({
    latitude: z.number(),
    longitude: z.number(),
    resolution: z.number(),
  })
  .strict();

type H3CellParams = z.infer<typeof h3CellParameters>;
type H3CellReturn = string;
type H3CellAdditionalData = { cell: string };


export const h3Cell: OpenAssistantTool<
  typeof h3CellParameters,
  H3CellReturn,
  H3CellAdditionalData
> = {
  name: 'h3Cell',
  description: 'Get the H3 cell for a given latitude, longitude and resolution',
  parameters: h3CellParameters,
  execute: async (args: H3CellParams, options) => {
    // Check if operation was aborted before starting
    if (options?.abortSignal?.aborted) {
      throw new Error('H3 cell operation was aborted');
    }

    const { latitude, longitude, resolution } = args;
    const cell = latLngToCell(latitude, longitude, resolution);
    return {
      llmResult: cell,
      additionalData: {
        cell,
      },
    };
  },
};

export const h3CellToChildren: OpenAssistantTool = {
  name: 'h3CellToChildren',
  description: 'Get the children of a given H3 cell',
  parameters: z.object({
    cell: z.string(),
  }),
  execute: async (args, options) => {
    // Check if operation was aborted before starting
    if (options?.abortSignal?.aborted) {
      throw new Error('H3 cell to children operation was aborted');
    }

    const { cell } = args as { cell: string };
    // get current resolution of given cell
    const resolution = getResolution(cell);
    // get children at resolution + 1
    const children = cellToChildren(cell, resolution + 1);

    return {
      llmResult: children,
      additionalData: {
        children,
      },
    };
  },
};

type H3CellsFromPolygonParams = {
  polygonDatasetName: string;
  resolution: number;
};

type H3CellsFromPolygonResult =
  | string[]
  | { success: boolean; result: string };

type H3CellsFromPolygonAdditionalData = {
  cells: string[];
};

export const h3CellsFromPolygon: OpenAssistantTool<
  z.ZodObject<{
    polygonDatasetName: z.ZodString;
    resolution: z.ZodNumber;
  }>,
  H3CellsFromPolygonResult,
  H3CellsFromPolygonAdditionalData,
  H3ToolContext
> = {
  name: 'h3CellsFromPolygon',
  description:
    'Get the H3 cells for a given polygon geojson at a given resolution',
  parameters: z.object({
    polygonDatasetName: z.string(),
    resolution: z.number(),
  }),
  execute: async (args, options) => {
    try {
      // Check if operation was aborted before starting
      if (options?.abortSignal?.aborted) {
        throw new Error('H3 cells from polygon operation was aborted');
      }

      const { polygonDatasetName, resolution } = args as H3CellsFromPolygonParams;
      
      if (!options?.context) {
        throw new Error('Context with getGeometries is required');
      }
      
      const { getGeometries } = options.context;
      const featureCollections = await getGeometries(polygonDatasetName);

      if (!featureCollections) {
        return {
          llmResult: {
            success: false,
            result: `No geometries found in ${polygonDatasetName}`,
          },
        };
      }
      const cells: string[] = [];
      for (const featureCollection of featureCollections) {
        const features = featureCollection.features;
        for (const feature of features) {
          // Build an array of polygon coordinate sets (supports Polygon and MultiPolygon)
          let coordsParts: number[][][][] = [];
          if (feature.geometry.type === 'Polygon') {
            coordsParts = [feature.geometry.coordinates as number[][][]];
          } else if (feature.geometry.type === 'MultiPolygon') {
            coordsParts = feature.geometry.coordinates as number[][][][];
          }
          for (const part of coordsParts) {
            const isGeoJson = true;
            // part is a single polygon: number[][][] in GeoJSON order
            const cellsForFeature = polygonToCells(part, resolution, isGeoJson);
            cells.push(...cellsForFeature);
          }
        }
      }

      return {
        llmResult: cells,
        additionalData: { cells },
      };
    } catch (error) {
      return {
        llmResult: {
          success: false,
          result: `Error getting H3 cells from polygon: ${error}`,
        },
      };
    }
  },
  context: {
    getGeometries: async () => {
      throw new Error('getGeometries() of h3CellsFromPolygon tool is not implemented');
    },
  },
};
