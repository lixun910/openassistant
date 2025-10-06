// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { z } from 'zod';
import { extendedTool, generateId } from '@openassistant/utils';
import { createHistogramBins } from './utils';
import {
  EChartsToolContext,
  isEChartsToolContext,
  OnSelected,
} from '../../types';

/**
 * The histogram tool is used to create a histogram chart for a given dataset and variable.
 *
 * @example
 * ```typescript
 * import { histogram, HistogramTool } from '@openassistant/plots';
 * import { convertToVercelAiTool } from '@openassistant/utils';
 * import { generateText } from 'ai';
 *
 * const toolContext = {
 *   getValues: async (datasetName: string, variableName: string) => {
 *     // get the values of the variable from dataset, e.g.
 *     return SAMPLE_DATASETS[datasetName].map((item) => item[variableName]);
 *   },
 * };
 *
 * const onToolCompleted = (toolCallId: string, additionalData?: unknown) => {
 *   console.log('Tool call completed:', toolCallId, additionalData);
 *   // render the histogram using <HistogramComponentContainer props={additionalData} />
 * };
 *
 * const histogramTool: HistogramTool = {
 *   ...histogram,
 *   context: toolContext,
 *   onToolCompleted,
 * };
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Can you create a histogram of the revenue per capita for each location in dataset myVenues?',
 *   tools: {
 *     histogram: convertToVercelAiTool(histogramTool),
 *   },
 * });
 * ```
 */
export const histogram = extendedTool<
  HistogramToolArgs,
  HistogramLlmResult,
  HistogramAdditionalData,
  EChartsToolContext
>({
  description: 'create a histogram',
  parameters: z.object({
    datasetName: z.string().describe('The name of the dataset.'),
    variableName: z
      .string()
      .describe('The name of the variable to create a histogram for.'),
    numberOfBins: z
      .number()
      .optional()
      .describe(
        'The number of bins to create in the histogram. Default value is 5.'
      ),
  }),
  execute: executeHistogram,
  context: {
    getValues: () => {
      throw new Error('getValues() of HistogramTool is not implemented');
    },
    onSelected: () => {},
    config: {
      isDraggable: false,
      isExpanded: false,
      theme: 'light',
    },
  },
});

/**
 * The type of the histogram tool.
 */
export type HistogramTool = typeof histogram;

export type HistogramToolArgs = z.ZodObject<{
  datasetName: z.ZodString;
  variableName: z.ZodString;
  numberOfBins: z.ZodOptional<z.ZodNumber>;
}>;

export type HistogramLlmResult = {
  success: boolean;
  result?: {
    id: string;
    datasetName: string;
    variableName: string;
    details: string;
  };
  error?: string;
  instruction?: string;
};

export type HistogramAdditionalData = {
  id: string;
  datasetName: string;
  variableName: string;
  histogramData: {
    bin: number;
    binStart: number | string;
    binEnd: number | string;
  }[];
  barDataIndexes: number[][];
  theme?: string;
  isDraggable?: boolean;
  isExpanded?: boolean;
  onSelected?: OnSelected;
};

/**
 * The result of the histogram tool.
 */
export type ExecuteHistogramResult = {
  llmResult: HistogramLlmResult;
  additionalData?: HistogramAdditionalData;
};

async function executeHistogram(
  { datasetName, variableName, numberOfBins = 5 },
  options
): Promise<ExecuteHistogramResult> {
  try {
    if (!isEChartsToolContext(options.context)) {
      throw new Error(
        'Invalid context for histogram tool. Please provide a valid context.'
      );
    }
    const { getValues, onSelected, config } = options.context;

    const values = await getValues(datasetName, variableName);

    // Create histogram bins
    const { histogramData, barDataIndexes } = createHistogramBins(
      values,
      numberOfBins
    );

    const id = generateId();

    return {
      llmResult: {
        success: true,
        result: {
          id,
          datasetName,
          variableName,
          details: `Histogram created successfully for variable ${variableName} with ${numberOfBins} bins. Histogram data: ${JSON.stringify(histogramData)}.`,
        },
      },
      additionalData: {
        id,
        datasetName,
        variableName,
        histogramData,
        barDataIndexes,
        theme: config?.theme || 'light',
        isDraggable: config?.isDraggable || false,
        isExpanded: config?.isExpanded || false,
        onSelected,
      },
    };
  } catch (error) {
    return {
      llmResult: {
        success: false,
        error: `Failed to create histogram. ${error}`,
        instruction:
          'Try to fix the error and create a histogram. If the error persists, pause the execution and ask the user to try with different prompt and context.',
      },
    };
  }
}
