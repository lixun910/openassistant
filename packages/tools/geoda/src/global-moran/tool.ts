// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OpenAssistantTool, OpenAssistantToolOptions, OpenAssistantToolExecutionOptions, OpenAssistantExecuteFunctionResult } from '@openassistant/utils';
import { z } from 'zod';
import { WeightsMeta } from '@geoda/core';
import { spatialLag } from '@geoda/lisa';
import {
  simpleLinearRegression,
  SimpleLinearRegressionResult,
} from '@openassistant/plots';

import { GetValues } from '../types';
import { getCachedWeightsById } from '../weights/tool';

export type SpatialWeights = {
  weights: number[][];
  weightsMeta: WeightsMeta;
};

export const GlobalMoranArgs = z.object({
  datasetName: z.string(),
  variableName: z.string(),
  weightsId: z
    .string()
    .optional()
    .describe(
      'The id of a spatial weights. It can be created using function tool "spatialWeights". If not provided, please try to create a weights first.'
    ),
});

export type MoranScatterPlotLlmResult = {
  success: boolean;
  globalMoranI?: number;
  result?: string;
  error?: string;
};

export type MoranScatterPlotAdditionalData = {
  datasetName: string;
  variableName: string;
  values: number[];
  lagValues: number[];
  regression: SimpleLinearRegressionResult;
  slope: number;
  isDraggable?: boolean;
  isExpanded?: boolean;
  theme?: string;
};

export type MoranScatterPlotFunctionContext = {
  getValues: GetValues;
};

/**
 * ## GlobalMoranTool Class
 *
 * Computes Global Moran's I to assess spatial autocorrelation of a numeric variable.
 *
 * ### Notes
 * - Use together with the `spatialWeights` tool. Provide a `weightsId` (returned by `spatialWeights`)
 *   so cached weights can be retrieved for the computation.
 *
 * ### Parameters
 * - `datasetName` (string): Source dataset id/name
 * - `variableName` (string): Numeric variable to analyze
 * - `weightsId` (string, optional): ID of precomputed spatial weights (from `spatialWeights`)
 *
 * ### Result
 * Returns `{ success, globalMoranI?, result?, error? }`; `additionalData` contains
 * `datasetName`, `variableName`, `values`, `lagValues`, `regression`, and `slope`.
 *
 * @example
 * ```typescript
 * import { GlobalMoranTool, SpatialWeightsTool } from '@openassistant/geoda';
 * import { generateText, tool } from 'ai';
 *
 * const weightsTool = new SpatialWeightsTool({ // provide getGeometries here });
 * const moranTool = new GlobalMoranTool({ // provide getValues here });
 *
 * const out = await generateText({
 *   model: openai('gpt-4.1', { apiKey: process.env.OPENAI_API_KEY }),
 *   prompt: "Compute Global Moran's I for population",
 *   tools: {
 *     spatialWeights: weightsTool.toVercelAiTool(tool),
 *     globalMoran: moranTool.toVercelAiTool(tool),
 *   },
 * });
 * ```
 */
export class GlobalMoranTool extends OpenAssistantTool<typeof GlobalMoranArgs> {
  protected getDefaultDescription(): string {
    return "Calculate Global Moran's I for a given variable";
  }
  
  protected getDefaultParameters() {
    return GlobalMoranArgs;
  }

  constructor(options: OpenAssistantToolOptions<typeof GlobalMoranArgs> = {}) {
    super({
      ...options,
      context: options.context || {
        getValues: () => {
          throw new Error('getValues not implemented.');
        },
      },
    });
  }

  async execute(
    args: z.infer<typeof GlobalMoranArgs>,
    options?: OpenAssistantToolExecutionOptions & { context?: Record<string, unknown> }
  ): Promise<OpenAssistantExecuteFunctionResult<MoranScatterPlotLlmResult, MoranScatterPlotAdditionalData>> {
    try {
      if (!isGlobalMoranArgs(args)) {
        throw new Error('Invalid arguments for globalMoran tool');
      }

      if (!options?.context || !isGlobalMoranContext(options.context)) {
        throw new Error('Invalid context for globalMoran tool');
      }

      const { datasetName, variableName, weightsId } = args;
      const { getValues } = options.context;

      const values = (await getValues(datasetName, variableName)) as number[];

      // get the weights
      let weights: number[][] | null = null;
      let weightsMeta: WeightsMeta | null = null;

      if (!weights && weightsId) {
        const existingWeights = getCachedWeightsById(weightsId);
        if (existingWeights) {
          weights = existingWeights.weights;
          weightsMeta = existingWeights.weightsMeta;
        }
      }

      if (!weightsId) {
        throw new Error('weightsId is required. Please run the spatialWeights tool first.');
      }

      if (!weights || !weightsMeta) {
        throw new Error(
          "Weights can not be found or created. Can not calculate Global Moran's I without weights."
        );
      }

      const lagValues = (await spatialLag(values, weights)) as number[];
      const regression = await simpleLinearRegression(values as number[], lagValues as number[]);
      const slope = regression.slope;

      return {
        llmResult: {
          success: true,
          globalMoranI: slope,
          result: `Global Moran's I is ${slope} for ${variableName} with ${weightsMeta.type} weights ${weightsId}.`,
        },
        additionalData: {
          datasetName,
          variableName,
          values,
          lagValues,
          regression,
          slope,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        llmResult: {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }
}

type GlobalMoranToolArgs = {
  datasetName: string;
  variableName: string;
  weightsId?: string;
};

export function isGlobalMoranArgs(args: unknown): args is GlobalMoranToolArgs {
  return (
    typeof args === 'object' &&
    args !== null &&
    'datasetName' in args &&
    'variableName' in args
  );
}

export function isWeightsOutputData(data: unknown): data is SpatialWeights {
  return (
    typeof data === 'object' &&
    data !== null &&
    'weights' in data &&
    'weightsMeta' in data
  );
}

export type GlobalMoranFunctionContext = {
  getValues: GetValues;
};

function isGlobalMoranContext(
  context: unknown
): context is GlobalMoranFunctionContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getValues' in context &&
    typeof context.getValues === 'function'
  );
}

 
