// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  OpenAssistantTool,
  OpenAssistantExecuteFunctionResult,
  generateId,
} from '@openassistant/utils';
import { calculateRates } from '@geoda/core';
import { z } from 'zod';

import { GetValues } from '../types';
import { getWeights } from '../utils';

/**
 * ## rate Tool
 *
 * This tool calculates rates from a base variable and an event variable using various statistical methods.
 * It's commonly used in epidemiology and spatial analysis to standardize rates across different populations.
 *
 * ### Rate Methods
 *
 * The rate calculation method can be one of the following types:
 * - **Raw Rates**: Simple division of events by base population
 * - **Excess Risk**: Measures excess risk compared to expected values
 * - **Empirical Bayes**: Uses Bayesian smoothing to stabilize rates
 * - **Spatial Rates**: Incorporates spatial information in rate calculation
 * - **Spatial Empirical Bayes**: Combines spatial and Bayesian smoothing
 * - **EB Rate Standardization**: Empirical Bayes with rate standardization
 *
 * ### Parameters
 * - `datasetName`: Name of the dataset containing the variables
 * - `baseVariableName`: Name of the base population variable (denominator)
 * - `eventVariableName`: Name of the event variable (numerator)
 * - `rateMethod`: Rate calculation method (see above)
 * - `weightsID`: ID of spatial weights matrix (required for spatial methods)
 * - `saveData`: Whether to save the calculated rates (optional)
 * - `outputRateVariableName`: Custom name for the output rate variable (optional)
 *
 * **Example user prompts:**
 * - "Calculate the excess risk rates from the base variable 'population' and the event variable 'crimes'"
 * - "Compute spatial empirical Bayes rates for disease incidence"
 * - "Calculate raw crime rates per capita"
 *
 * ### Example
 * ```typescript
 * import { rate } from "@openassistant/geoda";
 * import { convertToVercelAiTool } from "@openassistant/utils";
 *
 * const rateTool = {
 *   ...rate,
 *   context: {
 *     getValues: async (datasetName: string, variableName: string) => {
 *       // Implementation to retrieve values from your data source
 *       return [1000, 2000, 1500, 3000, 2500, 1800, 2200, 1900, 2800, 2100];
 *     },
 *   },
 * };
 *
 * const result = await generateText({
 *   model: openai('gpt-4.1', { apiKey: key }),
 *   prompt: 'Calculate the excess risk rates from the base variable "population" and the event variable "crimes"',
 *   tools: { rate: convertToVercelAiTool(rateTool) },
 * });
 * ```
 */
export const rate: OpenAssistantTool<
  RateFunctionArgs,
  RateLlmResult,
  RateAdditionalData,
  RateContext
> = {
  name: 'rate',
  description:
    'Calculate the rates from a base variable and an event variable.',
  parameters: z.object({
    datasetName: z.string(),
    baseVariableName: z.string(),
    eventVariableName: z.string(),
    rateMethod: z.enum([
      'Raw Rates',
      'Excess Risk',
      'Empirical Bayes',
      'Spatial Rates',
      'Spatial Empirical Bayes',
      'EB Rate Standardization',
    ]),
    saveData: z
      .boolean()
      .optional()
      .describe('Whether to save the rates data.'),
    outputRateVariableName: z
      .string()
      .optional()
      .describe('A name for the output rate variable based on the context.'),
    weightsID: z
      .string()
      .optional()
      .describe(
        'The weightsID of the spatial weights. Only required for spatial rates.'
      ),
  }),
  execute: async (
    args: z.infer<RateFunctionArgs>,
    options?: {
      toolCallId: string;
      abortSignal?: AbortSignal;
      context?: RateContext;
    }
  ): Promise<
    OpenAssistantExecuteFunctionResult<RateLlmResult, RateAdditionalData>
  > => {
    try {
      // Check if operation was aborted before starting
      if (options?.abortSignal?.aborted) {
        throw new Error('Rate calculation was aborted');
      }

      const {
        datasetName,
        baseVariableName,
        eventVariableName,
        rateMethod,
        weightsID,
        outputRateVariableName,
      } = args;
      if (!options?.context || !isRateContext(options.context)) {
        throw new Error('Context is required and must implement RateContext');
      }

      const { getValues } = options.context;
      const baseValues = (await getValues(
        datasetName,
        baseVariableName
      )) as number[];

      const eventValues = (await getValues(
        datasetName,
        eventVariableName
      )) as number[];

      // Get weights if needed
      const { weights } = getWeights(weightsID);

      if (!weights && rateMethod.startsWith('Spatial')) {
        throw new Error('Weights are required for spatial rates');
      }

      const rates = calculateRates({
        eventValues,
        baseValues,
        method: rateMethod,
        neighbors: weights ?? undefined,
      });

      // create an output dataset name
      const outputDatasetName = `rates_${generateId()}`;

      // create an output variable name
      const outputVariableName =
        outputRateVariableName ?? `rate_${generateId()}`;

      return {
        llmResult: {
          success: true,
          result: `The rates created successfully. The result is stored in the column ${outputVariableName} of the dataset ${outputDatasetName}.`,
        },
        additionalData: {
          datasetName: outputDatasetName,
          [outputDatasetName]: {
            type: 'columnData',
            content: {
              [outputVariableName]: rates,
            },
          },
        },
      };
    } catch (error: unknown) {
      return {
        llmResult: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  },
  context: {
    getValues: () => {
      throw new Error('getValues() of RateTool is not implemented');
    },
  },
};

export type RateFunctionArgs = z.ZodObject<{
  datasetName: z.ZodString;
  baseVariableName: z.ZodString;
  eventVariableName: z.ZodString;
  rateMethod: z.ZodEnum<['Raw Rates', 'Excess Risk', 'Empirical Bayes', 'Spatial Rates', 'Spatial Empirical Bayes', 'EB Rate Standardization']>;
  weightsID: z.ZodOptional<z.ZodString>;
  saveData: z.ZodOptional<z.ZodBoolean>;
  outputRateVariableName: z.ZodOptional<z.ZodString>;
}>;

export type RateLlmResult = {
  success: boolean;
  error?: string;
  details?: string;
  result?: string;
};

export type RateAdditionalData = {
  datasetName: string;
  [key: string]: unknown;
};

export type RateContext = {
  getValues: GetValues;
};

export function isRateContext(context: unknown): context is RateContext {
  return (
    typeof context === 'object' && context !== null && 'getValues' in context
  );
}

export type RateTool = typeof rate;
