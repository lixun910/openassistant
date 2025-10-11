// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { spatialJoin, SpatialJoinFunctionArgs, SpatialJoinLlmResult, SpatialJoinAdditionalData, SpatialJoinFunctionContext } from './tool';
import { OpenAssistantTool } from '@openassistant/utils';

/**
 * ## spatialFilter Tool
 * 
 * This tool filters geometries from one dataset based on their spatial relationship with geometries from another dataset.
 * It's useful for extracting subsets of spatial data that intersect with specific areas or boundaries.
 *
 * ### Spatial Filtering
 *
 * The tool filters geometries based on spatial relationships:
 * - **Points in Polygons**: Extract points that fall within polygon boundaries
 * - **Lines Intersecting Areas**: Filter lines that intersect with specific areas
 * - **Polygons Overlapping**: Select polygons that overlap with reference polygons
 *
 * ### Parameters
 * - `rightDatasetName`: Name of the dataset providing the filter geometries (e.g., polygons)
 * - `leftDatasetName`: Name of the dataset containing geometries to be filtered (e.g., points)
 * - `joinVariables`: Should be empty arrays for filtering operations
 *
 * **Example user prompts:**
 * - "Filter the crime incidents that fall within the downtown district"
 * - "Extract all schools located within the city boundaries"
 * - "Find all roads that intersect with the flood zone"
 *
 * ### Example
 * ```typescript
 * import { spatialFilter } from "@openassistant/geoda";
 * import { convertToVercelAiTool } from "@openassistant/utils";
 *
 * const filterTool = {
 *   ...spatialFilter,
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
 *   prompt: 'Filter the crime incidents that fall within the downtown district',
 *   tools: { spatialFilter: convertToVercelAiTool(filterTool) },
 * });
 * ```
 *
 * :::note
 * The left dataset should contain the geometries to be filtered (e.g., points).
 * The right dataset should contain the geometries used for filtering (e.g., polygons).
 * joinVariables should be empty arrays for filtering operations.
 * :::
 */
export const spatialFilter: OpenAssistantTool<
  SpatialJoinFunctionArgs,
  SpatialJoinLlmResult,
  SpatialJoinAdditionalData,
  SpatialJoinFunctionContext
> = {
  ...spatialJoin,
  name: 'spatialFilter',
  description: `Filter the geometries (points, lines, or polygons) from the left dataset that are spatially joined with the geometries from the right dataset.
Please Note:
1. The left dataset should be the dataset that contains the geometries to be filtered (e.g. points).
2. The right dataset should be the dataset that contains the geometries to be used for filtering (e.g. polygons).
3. joinVariables should be empty arrays.
`,
};
