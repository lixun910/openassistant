import { tool } from '@openassistant/utils';
import { z } from 'zod';
import { cacheData, getCachedData } from '../utils';

export type QueryZipcodeFunctionArgs = z.ZodObject<{
  mapBounds: z.ZodObject<{
    northwest: z.ZodObject<{
      longitude: z.ZodNumber;
      latitude: z.ZodNumber;
    }>;
    southeast: z.ZodObject<{
      longitude: z.ZodNumber;
      latitude: z.ZodNumber;
    }>;
  }>;
}>;

export type QueryZipcodeLlmResult = {
  success: boolean;
  zipcodes?: string[];
  result?: string;
  error?: string;
};

export type QueryZipcodeAdditionalData = {
  zipcodes: string[];
};

export type ExecuteQueryUSZipcodesResult = {
  llmResult: QueryZipcodeLlmResult;
  additionalData?: QueryZipcodeAdditionalData;
};

/**
 * Query US Zipcodes Tool
 * 
 * This tool queries US zipcodes within a given map bounds. It returns a list of zipcodes
 * with their coordinates that fall within the specified bounding box.
 * 
 * Example user prompts:
 * - "Find all zipcodes in Manhattan"
 * - "What zipcodes are in the San Francisco Bay Area?"
 * - "Get zipcodes within this map view"
 * 
 * Example code:
 * ```typescript
 * import { queryUSZipcodes, QueryUSZipcodesTool } from "@openassistant/osm";
 * 
 * const queryZipcodeTool: QueryUSZipcodesTool = {
 *   ...queryUSZipcodes,
 *   context: {}
 * };
 * ```
 */
export const queryUSZipcodes = tool<
  QueryZipcodeFunctionArgs,
  QueryZipcodeLlmResult,
  QueryZipcodeAdditionalData
>({
  description: 'Query US zipcodes within a given map bounds',
  parameters: z.object({
    mapBounds: z.object({
      northwest: z
        .object({
          longitude: z.number(),
          latitude: z.number(),
        })
        .describe('Northwest coordinates [longitude, latitude]'),
      southeast: z
        .object({
          longitude: z.number(),
          latitude: z.number(),
        })
        .describe('Southeast coordinates [longitude, latitude]'),
    }),
  }),
  execute: async (args): Promise<ExecuteQueryUSZipcodesResult> => {
    try {
      const { mapBounds } = args;
      const { northwest, southeast } = mapBounds;
      const cacheKey = 'us_zipcodes_centroids';

      let geojson = getCachedData(cacheKey);
      if (!geojson) {
        const response = await fetch(
          'https://raw.githubusercontent.com/GeoDaCenter/data-and-lab/refs/heads/gh-pages/data/us_zipcodes_centroids.geojson'
        );
        geojson = await response.json();
        if (geojson) {
          cacheData(cacheKey, geojson);
        }
      }

      if (!geojson || !('features' in geojson)) {
        throw new Error('Failed to fetch zipcode centroids data');
      }

      // Filter zipcodes within bounds
      const zipcodes = geojson.features
        .filter((feature) => {
          const coordinates = (feature.geometry as GeoJSON.Point).coordinates;
          const [longitude, latitude] = coordinates;
          return (
            longitude >= northwest.longitude &&
            longitude <= southeast.longitude &&
            latitude <= northwest.latitude &&
            latitude >= southeast.latitude
          );
        })
        .map((feature) => {
          const properties = feature.properties;
          if (!properties || !properties.ZCTA5CE10) {
            return null;
          }
          return properties.ZCTA5CE10;
        });

      return {
        llmResult: {
          success: true,
          result: `Found ${zipcodes.length} zipcodes within the specified bounds`,
          zipcodes,
        },
        additionalData: {
          zipcodes,
        },
      };
    } catch (error) {
      return {
        llmResult: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  },
});

export type QueryUSZipcodesTool = typeof queryUSZipcodes;
