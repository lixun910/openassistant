// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  OpenAssistantTool,
  OpenAssistantToolOptions,
  OpenAssistantToolExecutionOptions,
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

export const DataClassifyArgs = z.object({
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
});

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

/**
 * ## DataClassifyTool Class
 *
 * Classifies a numeric variable into bins/classes and returns break values.
 *
 * ### Supported methods
 * - quantile
 * - natural breaks
 * - equal interval
 * - percentile
 * - box (Tukey hinge: `hinge` = 1.5 by default; set 3.0 for 3×IQR)
 * - standard deviation
 * - unique values (returns the set of distinct values instead of breaks)
 *
 * ### Parameters
 * - `datasetName` (string): Source dataset id/name
 * - `variableName` (string): Numeric column to classify
 * - `method` (enum): One of the supported methods above
 * - `k` (number, optional): Number of classes; required for `quantile`, `natural breaks`, `equal interval`
 * - `hinge` (number, optional): Only used for `box` method; default is 1.5
 *
 * ### Result
 * Returns `{ success, result?, error?, instruction? }` where `result` includes
 * `originalDatasetName`, `variableName`, `method`, `k`, optional `hinge`, and
 * either `breaks` or `uniqueValues` depending on the method.
 *
 * @example
 * ```typescript
 * import { DataClassifyTool } from '@openassistant/geoda';
 * import { generateText, tool } from 'ai';
 *
 * const SAMPLE_DATASETS = {
 *   regions: [
 *     { "location": "New York", "latitude": 40.7128, "longitude": -74.0060, "population": 12500000 },
 *     { "location": "Chicago", "latitude": 41.8781, "longitude": -87.6298, "population": 2700000 },
 *     { "location": "Houston", "latitude": 29.7604, "longitude": -95.3698, "population": 2300000 },
 *     { "location": "Phoenix", "latitude": 33.4484, "longitude": -112.074, "population": 1600000 },
 *     { "location": "Philadelphia", "latitude": 39.9526, "longitude": -75.1652, "population": 1580000 },
 *     { "location": "San Antonio", "latitude": 29.4241, "longitude": -98.4936, "population": 1540000 },
 *     { "location": "San Diego", "latitude": 32.7157, "longitude": -117.1611, "population": 1420000 },
 *   ]
 * };
 *
 * const classifyTool = new DataClassifyTool({
 *   context: {
 *     getValues: async (datasetName: string, variableName: string) =>
 *       SAMPLE_DATASETS[datasetName].map((d) => d[variableName]),
 *   },
 * });
 *
 * const out = await generateText({
 *   model: openai('gpt-4.1', { apiKey: process.env.OPENAI_API_KEY }),
 *   system: 'You are a helpful assistant that can answer questions and help with tasks. The following datasets are available for tools: \nDatasetName: regions, \nFields: location, latitude, longitude, population',
 *   prompt: 'Classify population into 3 classes using natural breaks',
 *   tools: { dataClassify: classifyTool.toVercelAiTool(tool) },
 * });
 * ```
 */
export class DataClassifyTool extends OpenAssistantTool<
  typeof DataClassifyArgs
> {
  protected getDefaultDescription(): string {
    return 'Classify the data into k bins or categories, and return k-1 or k (for unique values) break values.';
  }

  protected getDefaultParameters() {
    return DataClassifyArgs;
  }

  constructor(options: OpenAssistantToolOptions<typeof DataClassifyArgs> = {}) {
    super({
      ...options,
      context: options.context || {
        getValues: () => {
          throw new Error('getValues() of DataClassifyTool is not implemented');
        },
      },
    });
  }

  async execute(
    args: z.infer<typeof DataClassifyArgs>,
    options?: OpenAssistantToolExecutionOptions & {
      context?: Record<string, unknown>;
    }
  ): Promise<
    OpenAssistantExecuteFunctionResult<
      DataClassifyLlmResult,
      DataClassifyAdditionalData
    >
  > {
    try {
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
