// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  OpenAssistantTool,
  OpenAssistantExecuteFunctionResult,
} from '@openassistant/utils';
import { z } from 'zod';
import {
  equalIntervalBreaks,
  hinge15Breaks,
  hinge30Breaks,
  naturalBreaks,
  percentileBreaks,
  quantileBreaks,
  standardDeviationBreaks,
} from '@geoda/core';
import { GetValues } from '../types';

export type DataClassifyFunctionArgs = z.ZodObject<{
  datasetName: z.ZodString;
  variableName: z.ZodString;
  method: z.ZodEnum<['quantile', 'natural breaks', 'equal interval', 'percentile', 'box', 'standard deviation', 'unique values']>;
  k: z.ZodOptional<z.ZodNumber>;
  hinge: z.ZodOptional<z.ZodNumber>;
}>;

export type DataClassifyLlmResult = {
  success: boolean;
  result?: {
    datasetName: string;
    variableName: string;
    method: string;
    k?: number;
    hinge?: number;
    breaks: number[];
  };
  error?: string;
  instruction?: string;
};

export type DataClassifyAdditionalData = {
  originalDatasetName: string;
  variableName: string;
  method: string;
  k: number;
  hinge?: number;
  breaks: number[];
};

export type DataClassifyFunctionContext = {
  getValues: GetValues;
};

/**
 * ## dataClassify Tool
 *
 * This tool is used to classify numerical data into k bins or classes using various statistical methods.
 * It returns break points that can be used to categorize continuous data into discrete intervals.
 *
 * ### Classification Methods
 *
 * The classification method can be one of the following types:
 * - **quantile**: Divides data into equal-sized groups based on quantiles
 * - **natural breaks**: Uses Jenks' algorithm to minimize within-group variance
 * - **equal interval**: Creates intervals of equal width across the data range
 * - **percentile**: Uses percentile-based breaks (25th, 50th, 75th percentiles)
 * - **box**: Uses box plot statistics (hinge = 1.5 or 3.0)
 * - **standard deviation**: Creates breaks based on standard deviation intervals
 * - **unique values**: Returns all unique values in the dataset
 *
 * ### Parameters
 * - `datasetName`: Name of the dataset containing the variable
 * - `variableName`: Name of the numerical variable to classify
 * - `method`: Classification method (see above)
 * - `k`: Number of bins/classes (required for quantile, natural breaks, equal interval)
 * - `hinge`: Hinge value for box method (default: 1.5)
 *
 * **Example user prompts:**
 * - "Can you classify the population data into 5 classes using natural breaks?"
 * - "Classify the income variable using quantile method with 4 bins"
 * - "Use box plot method to classify the housing prices"
 *
 * ### Example
 * ```typescript
 * import { dataClassify } from "@openassistant/geoda";
 * import { convertToVercelAiTool } from "@openassistant/utils";
 *
 * const classifyTool = {
 *   ...dataClassify,
 *   context: {
 *     getValues: async (datasetName: string, variableName: string) => {
 *       // Implementation to retrieve values from your data source
 *       return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
 *     },
 *   },
 * };
 *
 * // Usage with AI model
 * const result = await generateText({
 *   model: yourModel,
 *   prompt: 'Can you classify the population data into 5 classes using natural breaks?',
 *   tools: { dataClassify: convertToVercelAiTool(classifyTool) },
 * });
 * ```
 */
export const dataClassify: OpenAssistantTool<
  DataClassifyFunctionArgs,
  DataClassifyLlmResult,
  DataClassifyAdditionalData,
  DataClassifyFunctionContext
> = {
  name: 'dataClassify',
  description:
    'Classify the numeric values into k bins or categories, and return k-1 or k (for unique values) break values. The values can be retrieved from the dataset using the variableName and datasetName.',
  parameters: z.object({
    datasetName: z.string(),
    variableName: z.string(),
    method: z
      .enum([
        'quantile',
        'natural breaks',
        'equal interval',
        'percentile',
        'box',
        'standard deviation',
        'unique values',
      ])
      .describe('The classification method.'),
    k: z
      .number()
      .optional()
      .describe(
        'The number of bins or classes. This is only required for quantile, natural breaks, equal interval.'
      ),
    hinge: z
      .number()
      .optional()
      .describe('The hinge value when box method is used. Default is 1.5.'),
  }),
  execute: executeDataClassify,
  context: {
    getValues: () => {
      throw new Error('getValues() of DataClassifyTool is not implemented');
    },
  },
};

export type DataClassifyTool = typeof dataClassify;

type DataClassifyToolArgs = {
  datasetName: string;
  variableName: string;
  method: string;
  k: number;
  hinge?: number;
};

function isDataClassifyToolArgs(args: unknown): args is DataClassifyToolArgs {
  return (
    typeof args === 'object' &&
    args !== null &&
    'datasetName' in args &&
    typeof args.datasetName === 'string' &&
    'variableName' in args &&
    typeof args.variableName === 'string' &&
    'method' in args &&
    typeof args.method === 'string'
  );
}

function isDataClassifyContext(
  context: unknown
): context is DataClassifyFunctionContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getValues' in context &&
    typeof context.getValues === 'function'
  );
}

async function executeDataClassify(
  args: z.infer<DataClassifyFunctionArgs>,
  options?: {
    toolCallId: string;
    abortSignal?: AbortSignal;
    context?: DataClassifyFunctionContext;
  }
): Promise<
  OpenAssistantExecuteFunctionResult<
    DataClassifyLlmResult,
    DataClassifyAdditionalData
  >
> {
  try {
    // Check if operation was aborted before starting
    if (options?.abortSignal?.aborted) {
      throw new Error('Data classify operation was aborted');
    }

    if (!isDataClassifyToolArgs(args)) {
      throw new Error('Invalid arguments for dataClassify tool');
    }

    if (!options?.context || !isDataClassifyContext(options.context)) {
      throw new Error('Invalid context for dataClassify tool');
    }

    const { datasetName, variableName, method, k, hinge } = args;
    const { getValues } = options.context;

    return runDataClassify({
      datasetName,
      variableName,
      method,
      k,
      hinge,
      getValues,
    });
  } catch (error) {
    console.error('Error executing dataClassify tool:', error);
    return {
      llmResult: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        instruction:
          'Please explain the error and give a plan to fix the error. Then try again with a different query.',
      },
    };
  }
}

export async function runDataClassify({
  datasetName,
  variableName,
  method,
  k,
  hinge = 1.5,
  getValues,
}: {
  datasetName: string;
  variableName: string;
  method: string;
  k: number;
  hinge?: number;
  getValues: GetValues;
}) {
  try {
    const values = await getValues(datasetName, variableName);

    let breaks;
    let uniqueValues;
    switch (method) {
      case 'quantile':
        breaks = await quantileBreaks(k, values as number[]);
        break;
      case 'natural breaks':
        breaks = await naturalBreaks(k, values as number[]);
        break;
      case 'equal interval':
        breaks = await equalIntervalBreaks(k, values as number[]);
        break;
      case 'percentile':
        breaks = await percentileBreaks(values as number[]);
        break;
      case 'box':
        breaks =
          hinge === 3.0
            ? await hinge30Breaks(values as number[])
            : await hinge15Breaks(values as number[]);
        break;
      case 'standard deviation':
        breaks = await standardDeviationBreaks(values as number[]);
        break;
      case 'unique values':
        // get unique values
        uniqueValues = [...new Set(values)];
        break;
      default:
        breaks = await quantileBreaks(k, values as number[]);
        break;
    }

    const result = {
      originalDatasetName: datasetName,
      variableName,
      method,
      k,
      ...(hinge && { hinge }),
      ...(breaks && { breaks }),
      ...(uniqueValues && { uniqueValues }),
    };

    return {
      llmResult: {
        success: true,
        result,
      },
      additionalData: result,
    };
  } catch (error) {
    return {
      llmResult: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
}
