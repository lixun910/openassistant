// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  OpenAssistantTool,
  OpenAssistantExecuteFunctionResult,
  generateId,
} from '@openassistant/utils';
import { z } from 'zod';
import {
  LinearRegressionResult,
  SpatialErrorResult,
  SpatialLagResult,
} from '@geoda/regression';

import { GetValues, WeightsProps } from '../types';
import { printRegressionResult, runRegression } from './utils';
import { getWeights } from '../utils';

export type SpatialRegressionFunctionArgs = z.ZodObject<{
  datasetName: z.ZodString;
  dependentVariable: z.ZodString;
  independentVariables: z.ZodArray<z.ZodString>;
  modelType: z.ZodEnum<{
    classic: 'classic';
    'spatial-lag': 'spatial-lag';
    'spatial-error': 'spatial-error';
  }>;
  weightsId: z.ZodOptional<z.ZodString>;
}>;

export type SpatialRegressionLlmResult = {
  success: boolean;
  result?: string;
  error?: string;
};

export type SpatialRegressionAdditionalData = {
  datasetName: string;
  report: LinearRegressionResult | SpatialLagResult | SpatialErrorResult | null;
};

export type SpatialRegressionFunctionContext = {
  getValues: GetValues;
  config?: {
    theme?: string;
  };
};

/**
 * ## spatialRegression Tool
 *
 * This tool performs regression analysis with spatial data, accounting for spatial effects that may violate the independence assumption of classical regression.
 * It supports both classical and spatial regression models with proper diagnostics.
 *
 * ### Spatial Regression Models
 *
 * The tool supports three types of regression models:
 * - **classic**: Ordinary Least Squares (OLS) regression with spatial diagnostics
 * - **spatial-lag**: Spatial lag model accounting for spatial dependence in the dependent variable
 * - **spatial-error**: Spatial error model accounting for spatial dependence in the error term
 *
 * ### Parameters
 * - `datasetName`: Name of the dataset containing the variables
 * - `dependentVariable`: Name of the dependent variable (y)
 * - `independentVariables`: Array of independent variable names (x1, x2, ...)
 * - `modelType`: Type of regression model (see above)
 * - `weightsId`: ID of spatial weights matrix (required for spatial models)
 *
 * **Example user prompts:**
 * - "Can you run a spatial regression analysis on the housing data?"
 * - "Perform a spatial lag regression of revenue ~ population + income"
 * - "Run OLS regression with spatial diagnostics for crime rates"
 *
 * ### Example
 * ```typescript
 * import { spatialRegression } from "@openassistant/geoda";
 * import { convertToVercelAiTool } from "@openassistant/utils";
 *
 * const regressionTool = {
 *   ...spatialRegression,
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
 *   prompt: 'Can you run a spatial regression analysis of "revenue ~ population + income" on the data?',
 *   tools: { spatialRegression: convertToVercelAiTool(regressionTool) },
 * });
 * ```
 *
 * :::note
 * Please only use knowledge from Luc Anselin's GeoDa book and the GeoDa documentation to answer questions about spatial regression.
 * :::
 */
export const spatialRegression: OpenAssistantTool<
  SpatialRegressionFunctionArgs,
  SpatialRegressionLlmResult,
  SpatialRegressionAdditionalData,
  SpatialRegressionFunctionContext
> = {
  name: 'spatialRegression',
  description: `Apply spatial regression analysis.
Note:
- please only use the knowledge from Luc Anselin's GeoDa book and the GeoDa documentation to answer the question
- you can run spatial diagnostics with OLS model if you need to determine if spatial regression model is needed
- do NOT run global Moran's I with independent variables to determine if spatial regression model is needed
- you can run spatial models if you need to account for spatial effects in the model
- please provide suggestions for improving the model and the results
  `,
  parameters: z.object({
    datasetName: z.string(),
    dependentVariable: z.string(),
    independentVariables: z.array(z.string()),
    modelType: z.enum(['classic', 'spatial-lag', 'spatial-error']),
    weightsId: z
      .string()
      .optional()
      .describe(
        'The id of the spatial weights for spatial diagnostics in classic model or spatial models'
      ),
  }),
  execute: executeSpatialRegression,
  context: {
    getValues: () => {
      throw new Error('getValues not implemented.');
    },
  },
};

export type SpatialRegressionTool = typeof spatialRegression;

type SpatialRegressionArgs = {
  datasetName: string;
  dependentVariable: string;
  independentVariables: string[];
  modelType: string;
  weightsId?: string;
};

export function isSpatialRegressionArgs(
  args: unknown
): args is SpatialRegressionArgs {
  return (
    typeof args === 'object' &&
    args !== null &&
    'datasetName' in args &&
    'dependentVariable' in args &&
    'independentVariables' in args &&
    'modelType' in args
  );
}

function isSpatialRegressionContext(
  context: unknown
): context is SpatialRegressionFunctionContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getValues' in context &&
    typeof context.getValues === 'function'
  );
}

async function executeSpatialRegression(
  args: z.infer<SpatialRegressionFunctionArgs>,
  options?: {
    toolCallId: string;
    abortSignal?: AbortSignal;
    context?: SpatialRegressionFunctionContext;
    previousExecutionOutput?: unknown[];
  }
): Promise<
  OpenAssistantExecuteFunctionResult<
    SpatialRegressionLlmResult,
    SpatialRegressionAdditionalData
  >
> {
  try {
    if (!isSpatialRegressionArgs(args)) {
      throw new Error('Invalid arguments for spatialRegression tool');
    }

    if (!options?.context || !isSpatialRegressionContext(options.context)) {
      throw new Error('Invalid context for spatialRegression tool');
    }

    const {
      datasetName,
      dependentVariable,
      independentVariables,
      modelType,
      weightsId,
    } = args;
    const { getValues } = options.context;

    // Get the dependent variable values
    const yValues = await getValues(datasetName, dependentVariable);

    // Get the independent variables values
    const xValues = await Promise.all(
      independentVariables.map((varName) => getValues(datasetName, varName))
    );

    // Get weights if needed
    const { weights, weightsMeta } = getWeights(weightsId);

    if (
      !weights &&
      (modelType === 'spatial-lag' || modelType === 'spatial-error')
    ) {
      throw new Error(
        'Weights are required for spatial-lag or spatial-error models'
      );
    }

    const weightsProps: WeightsProps | undefined =
      weights && weightsMeta
        ? {
            datasetId: datasetName,
            weightsMeta: weightsMeta,
            weights: weights,
          }
        : undefined;

    const regression = await runRegression({
      datasetName,
      model: modelType || 'classic',
      x: xValues as number[][],
      y: yValues as number[],
      xNames: independentVariables,
      yName: dependentVariable,
      weights: weightsProps,
    });

    const report = regression.result;
    const regressionReport = printRegressionResult(report);

    const outputDatasetName = `regression_${generateId()}`;

    return {
      llmResult: {
        success: true,
        result: regressionReport,
      },
      additionalData: {
        datasetName: outputDatasetName,
        report,
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
