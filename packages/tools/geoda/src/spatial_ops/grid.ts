// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  OpenAssistantTool,
  OpenAssistantExecuteFunctionResult,
  generateId,
} from '@openassistant/utils';
import { z } from 'zod';
import {
  Feature,
  Polygon,
  FeatureCollection,
  GeoJsonProperties,
} from 'geojson';
import {
  SpatialGeometry,
  CheckGeometryType,
  SpatialJoinGeometryType,
} from '@geoda/core';
import { bbox } from '@turf/bbox';
import { polygon } from '@turf/helpers';
import { binaryToGeojson } from '@loaders.gl/gis';

import { isSpatialToolContext } from '../utils';
import { SpatialToolContext } from '../types';

export type GridFunctionArgs = z.ZodObject<{
  datasetName: z.ZodOptional<z.ZodString>;
  mapBounds: z.ZodOptional<
    z.ZodObject<{
      northwest: z.ZodObject<{
        longitude: z.ZodNumber;
        latitude: z.ZodNumber;
      }>;
      southeast: z.ZodObject<{
        longitude: z.ZodNumber;
        latitude: z.ZodNumber;
      }>;
    }>
  >;
  rows: z.ZodNumber;
  columns: z.ZodNumber;
}>;

export type GridLlmResult = {
  success: boolean;
  result: string;
  gridInfo: {
    rows: number;
    columns: number;
    totalCells: number;
    bounds: {
      minX: number;
      minY: number;
      maxX: number;
      maxY: number;
    };
  };
};

export type GridAdditionalData = {
  datasetName?: string;
  mapBounds?: {
    northwest: { longitude: number; latitude: number };
    southeast: { longitude: number; latitude: number };
  };
  [outputDatasetName: string]: unknown;
};

/**
 * Convert SpatialGeometry to GeoJSON FeatureCollection
 */
function spatialGeometryToGeoJSON(
  geometries: SpatialGeometry
): FeatureCollection {
  const geometryType = CheckGeometryType(geometries);

  switch (geometryType) {
    case SpatialJoinGeometryType.BinaryFeatureCollection: {
      // convert binary to geojson and flatten the results
      const features: Feature[] = geometries.flatMap((binary) => {
        const result = binaryToGeojson(binary);
        return Array.isArray(result) ? result : [result];
      });
      return {
        type: 'FeatureCollection',
        features,
      };
    }
    case SpatialJoinGeometryType.GeoJsonFeature: {
      return {
        type: 'FeatureCollection',
        features: geometries as Feature[],
      };
    }
    case SpatialJoinGeometryType.ArcLayerData: {
      // convert {source: [], target: [], index: number} to Feature
      const features: Feature[] = geometries.map((feature) => {
        return {
          type: 'Feature' as const,
          geometry: {
            type: 'LineString' as const,
            coordinates: [feature.source, feature.target],
          },
        } as Feature;
      });
      return {
        type: 'FeatureCollection',
        features,
      };
    }
    case SpatialJoinGeometryType.PointLayerData: {
      const features: Feature[] = geometries.map((feature) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: feature.position,
        },
        properties: {} as GeoJsonProperties,
      }));
      return {
        type: 'FeatureCollection',
        features,
      };
    }
    default:
      throw new Error('Unsupported geometry type for grid generation');
  }
}

/**
 * ## grid Tool
 *
 * This tool creates a grid of polygons that divides a given area into N rows and M columns.
 * It's useful for spatial analysis, creating regular grids for sampling, or dividing areas into equal sections.
 *
 * ### Grid Creation
 *
 * The tool creates regular grids with the following features:
 * - **Customizable Dimensions**: Specify number of rows and columns
 * - **Boundary-based**: Create grids within dataset boundaries or map view bounds
 * - **Equal-sized Cells**: Each grid cell has equal area
 * - **Spatial Reference**: Maintains proper coordinate system
 *
 * ### Parameters
 * - `datasetName`: Name of the dataset with boundary geometry to create grid within (optional)
 * - `mapBounds`: Map bounds defined by northwest and southeast coordinates (optional)
 * - `rows`: Number of rows in the grid (N)
 * - `columns`: Number of columns in the grid (M)
 *
 * **Example user prompts:**
 * - "Create a 5x5 grid over this area"
 * - "Divide this region into a 10 by 8 grid"
 * - "Generate a grid with 6 rows and 4 columns for this boundary"
 * - "Create a 3x3 grid for the current map view"
 *
 * ### Example
 * ```typescript
 * import { grid } from "@openassistant/geoda";
 * import { convertToVercelAiTool } from "@openassistant/utils";
 *
 * const gridTool = {
 *   ...grid,
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
 *   prompt: 'Create a 5x5 grid over this area',
 *   tools: { grid: convertToVercelAiTool(gridTool) },
 * });
 * ```
 */
export const grid: OpenAssistantTool<
  GridFunctionArgs,
  GridLlmResult,
  GridAdditionalData,
  SpatialToolContext
> = {
  name: 'grid',
  description:
    'Create a grid of polygons that divides a map boundary into rows and columns. The map boundary can be the boundary of a given dataset or the current map view bounds.',
  parameters: z.object({
    datasetName: z
      .string()
      .optional()
      .describe(
        'Name of the dataset with boundary geometry to create grid within'
      ),
    mapBounds: z
      .object({
        northwest: z.object({
          longitude: z.number().describe('Longitude of northwest corner'),
          latitude: z.number().describe('Latitude of northwest corner'),
        }),
        southeast: z.object({
          longitude: z.number().describe('Longitude of southeast corner'),
          latitude: z.number().describe('Latitude of southeast corner'),
        }),
      })
      .optional()
      .describe('Map bounds defined by northwest and southeast coordinates'),
    rows: z.number().positive().describe('Number of rows in the grid (N)'),
    columns: z
      .number()
      .positive()
      .describe('Number of columns in the grid (M)'),
  }),
  execute: async (
    args: z.infer<GridFunctionArgs>,
    options?: {
      toolCallId: string;
      abortSignal?: AbortSignal;
      context?: SpatialToolContext;
    }
  ): Promise<
    OpenAssistantExecuteFunctionResult<GridLlmResult, GridAdditionalData>
  > => {
    const { datasetName, mapBounds, rows, columns } = args;

    if (!options?.context || !isSpatialToolContext(options.context)) {
      throw new Error(
        'Context is required and must implement SpatialToolContext'
      );
    }
    const { getGeometries } = options.context;

    let minX: number, minY: number, maxX: number, maxY: number;

    if (mapBounds) {
      // Use explicit map bounds
      minX = mapBounds.northwest.longitude;
      maxX = mapBounds.southeast.longitude;
      minY = mapBounds.southeast.latitude;
      maxY = mapBounds.northwest.latitude;

      // Ensure proper ordering (in case northwest/southeast are swapped)
      if (minX > maxX) [minX, maxX] = [maxX, minX];
      if (minY > maxY) [minY, maxY] = [maxY, minY];
    } else if (datasetName && getGeometries) {
      // Use dataset bounds
      const geometries = await getGeometries(datasetName);
      if (!geometries) {
        throw new Error('No boundary geometry found');
      }
      const featureCollection = spatialGeometryToGeoJSON(geometries);
      [minX, minY, maxX, maxY] = bbox(featureCollection);
    } else {
      throw new Error(
        'No boundary geometry or map bounds provided. Please provide either datasetName or mapBounds.'
      );
    }

    // Calculate grid cell dimensions
    const cellWidth = (maxX - minX) / columns;
    const cellHeight = (maxY - minY) / rows;

    // Create grid cells
    const gridFeatures: Feature<Polygon>[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const x1 = minX + col * cellWidth;
        const y1 = minY + row * cellHeight;
        const x2 = x1 + cellWidth;
        const y2 = y1 + cellHeight;

        const cellPolygon = polygon(
          [
            [
              [x1, y1],
              [x2, y1],
              [x2, y2],
              [x1, y2],
              [x1, y1],
            ],
          ],
          {
            row: row,
            column: col,
            gridId: `${row}_${col}`,
            bounds: {
              minX: x1,
              minY: y1,
              maxX: x2,
              maxY: y2,
            },
          }
        );

        gridFeatures.push(cellPolygon);
      }
    }

    // Create output dataset
    const outputDatasetName = `grid_${generateId()}`;
    const outputGeojson: FeatureCollection = {
      type: 'FeatureCollection',
      features: gridFeatures,
    };

    const totalCells = rows * columns;
    const bounds = { minX, minY, maxX, maxY };

    return {
      llmResult: {
        success: true,
        result: `Grid created successfully with ${rows} rows and ${columns} columns (${totalCells} total cells). It has been saved in dataset: ${outputDatasetName}`,
        gridInfo: {
          rows,
          columns,
          totalCells,
          bounds,
        },
      },
      additionalData: {
        datasetName: outputDatasetName,
        mapBounds,
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

export type GridTool = typeof grid;
