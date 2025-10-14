// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OpenAssistantTool, OpenAssistantExecuteFunctionResult } from '@openassistant/utils';
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

export type MoranScatterPlotFunctionArgs = z.ZodObject<{
  datasetName: z.ZodString;
  variableName: z.ZodString;
  weightsId: z.ZodOptional<z.ZodString>;
}>;

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
 * ## globalMoran Tool
 * 
 * This tool calculates Global Moran's I for a given variable to test for spatial autocorrelation.
 * It measures whether similar values tend to cluster together in space or are randomly distributed.
 *
 * ### Global Moran's I
 *
 * Global Moran's I is a measure of spatial autocorrelation that ranges from -1 to +1:
 * - **Positive values**: Indicate positive spatial autocorrelation (clustering of similar values)
 * - **Negative values**: Indicate negative spatial autocorrelation (dispersion of similar values)
 * - **Values near 0**: Indicate no spatial autocorrelation (random distribution)
 *
 * ### Parameters
 * - `datasetName`: Name of the dataset containing the variable
 * - `variableName`: Name of the numerical variable to analyze
 * - `weightsId`: ID of spatial weights matrix (optional, will use cached weights if available)
 *
 * **Example user prompts:**
 * - "Is the population data spatially clustered or dispersed?"
 * - "Calculate Global Moran's I for the income variable"
 * - "Test for spatial autocorrelation in housing prices"
 *
 * ### Example
 * ```typescript
 * import { globalMoran } from "@openassistant/geoda";
 * import { convertToVercelAiTool } from "@openassistant/utils";
 *
 * const moranTool = {
 *   ...globalMoran,
 *   context: {
 *     getValues: async (datasetName: string, variableName: string) => {
 *       // Implementation to retrieve values from your data source
 *       return [100, 200, 150, 300, 250, 180, 220, 190, 280, 210];
 *     },
 *   },
 * };
 *
 * const result = await generateText({
 *   model: openai('gpt-4.1', { apiKey: key }),
 *   prompt: 'Calculate Global Moran\'s I for the population data',
 *   tools: { globalMoran: convertToVercelAiTool(moranTool) },
 * });
 * ```
 *
 * :::note
 * The global Moran's I tool should always be used with the spatialWeights tool. The LLM models know how to use the spatialWeights tool for the Moran scatterplot analysis.
 * :::
 */
export const globalMoran: OpenAssistantTool<
  MoranScatterPlotFunctionArgs,
  MoranScatterPlotLlmResult,
  MoranScatterPlotAdditionalData,
  MoranScatterPlotFunctionContext
> = {
  name: 'globalMoran',
  description: "Calculate Global Moran's I for a given variable",
  parameters: z.object({
    datasetName: z.string(),
    variableName: z.string(),
    weightsId: z
      .string()
      .optional()
      .describe(
        'The id of a spatial weights. It can be created using function tool "spatialWeights". If not provided, please try to create a weights first.'
      ),
  }),
  execute: executeGlobalMoran,
  context: {
    getValues: () => {
      throw new Error('getValues not implemented.');
    },
  },
};

export type GlobalMoranTool = typeof globalMoran;

type GlobalMoranArgs = {
  datasetName: string;
  variableName: string;
  weightsId?: string;
};

export function isGlobalMoranArgs(args: unknown): args is GlobalMoranArgs {
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

async function executeGlobalMoran(
  args: z.infer<MoranScatterPlotFunctionArgs>,
  options?: {
    toolCallId: string;
    abortSignal?: AbortSignal;
    context?: MoranScatterPlotFunctionContext;
    previousExecutionOutput?: unknown[];
  }
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

    // get the values of the variable
    const values = await getValues(datasetName, variableName);

    // get the weights
    let weights: number[][] | null = null;
    let weightsMeta: WeightsMeta | null = null;

    if (options.previousExecutionOutput) {
      // check if weightsId can be retrived from previousExecutionOutput
      options.previousExecutionOutput.forEach((output: unknown) => {
        if (typeof output === 'object' && output !== null && 'data' in output) {
          const outputWithData = output as { data: unknown };
          if (isWeightsOutputData(outputWithData.data)) {
            weights = outputWithData.data.weights;
            weightsMeta = outputWithData.data.weightsMeta;
          }
        }
      });
    }

    if (!weights && weightsId) {
      // get weights from cache inside openassistant/geoda module
      const existingWeights = getCachedWeightsById(weightsId);
      if (existingWeights) {
        weights = existingWeights.weights;
        weightsMeta = existingWeights.weightsMeta;
      }
    }

    if (!weights || !weightsMeta || !weightsId) {
      throw new Error(
        "Weights can not be found or created. Can not calculate Global Moran's I without weights."
      );
    }

    const lagValues = await spatialLag(values as number[], weights);
    const regression = await simpleLinearRegression(values as number[], lagValues);
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
        values: values as number[],
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
