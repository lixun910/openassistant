// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OpenAssistantTool, generateId } from '@openassistant/utils';
import { z } from 'zod';

import {
  deviationFromMean,
  standardizeMAD,
  rangeAdjust,
  rangeStandardize,
  standardize,
} from '@geoda/core';
import { GetValues } from '@openassistant/plots';

export type StandardizeVariableToolArgs = z.ZodObject<{
  datasetName: z.ZodString;
  variableName: z.ZodString;
  standardizationMethod: z.ZodEnum<['deviationFromMean', 'standardizeMAD', 'rangeAdjust', 'rangeStandardize', 'standardize']>;
  saveData: z.ZodOptional<z.ZodBoolean>;
}>;

export type StandardizeVariableToolLlmResult = {
  success: boolean;
  details?: string;
  error?: string;
  instruction?: string;
};

export type StandardizeVariableToolAdditionalData = {
  saveData: boolean;
  datasetName: string;
  [key: string]:
    | {
        type: string;
        content: Record<string, number[]>;
      }
    | unknown;
};

export type StandardizeVariableToolResult = {
  llmResult: StandardizeVariableToolLlmResult;
  additionalData?: StandardizeVariableToolAdditionalData;
};

export type StandardizeVariableToolContext = {
  getValues: GetValues;
};

/**
 * ## standardizeVariable Tool
 *
 * This tool standardizes a variable using various statistical methods.
 * Standardization transforms data to have a mean of 0 and standard deviation of 1, making different variables comparable.
 *
 * ### Standardization Methods
 *
 * The tool supports various standardization methods:
 * - **deviationFromMean**: Standardizes to mean=0, std=1 (most common)
 * - **standardizeMAD**: Uses median and MAD instead of mean and std
 * - **rangeAdjust**: Scales to range [0,1]
 * - **rangeStandardize**: Scales using interquartile range
 * - **standardize**: Z-score standardization
 *
 * ### Parameters
 * - `datasetName`: Name of the dataset containing the variable
 * - `variableName`: Name of the variable to standardize
 * - `standardizationMethod`: Standardization method to use (see above)
 * - `saveData`: Whether to save the standardized values (optional)
 *
 * **Example user prompts:**
 * - "Standardize the population variable using z-score method"
 * - "Normalize the income data using min-max scaling"
 * - "Apply robust standardization to the housing prices"
 *
 * ### Example
 * ```typescript
 * import { standardizeVariable } from "@openassistant/geoda";
 * import { convertToVercelAiTool } from "@openassistant/utils";
 *
 * const standardizeTool = {
 *   ...standardizeVariable,
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
 *   prompt: 'Standardize the population variable using z-score method',
 *   tools: { standardizeVariable: convertToVercelAiTool(standardizeTool) },
 * });
 * ```
 */
export const standardizeVariable: OpenAssistantTool<
  StandardizeVariableToolArgs,
  StandardizeVariableToolLlmResult,
  StandardizeVariableToolAdditionalData,
  StandardizeVariableToolContext
> = {
  name: 'standardizeVariable',
  description:
    'Standardize the data of a variable using one of the following methods: deviation from mean, standardize MAD, range adjust, range standardize, standardize (Z-score)',
  parameters: z.object({
    datasetName: z.string(),
    variableName: z.string(),
    standardizationMethod: z.enum([
      'deviationFromMean',
      'standardizeMAD',
      'rangeAdjust',
      'rangeStandardize',
      'standardize',
    ]),
    saveData: z.boolean().optional(),
  }),
  context: {
    getValues: () => {
      throw new Error(
        'getValues() of StandardizeVariableTool is not implemented'
      );
    },
  },
  execute: async (
    args: z.infer<StandardizeVariableToolArgs>,
    options?: {
      toolCallId: string;
      abortSignal?: AbortSignal;
      context?: StandardizeVariableToolContext;
    }
  ): Promise<StandardizeVariableToolResult> => {
    try {
      // Check if operation was aborted before starting
      if (options?.abortSignal?.aborted) {
        throw new Error('Variable standardization was aborted');
      }

      const { datasetName, variableName, standardizationMethod, saveData } =
        args;
      const { getValues } = options?.context as StandardizeVariableToolContext;

      const values = await getValues(datasetName, variableName);

      let standardizedValues: number[] | undefined;

      switch (standardizationMethod) {
        case 'deviationFromMean':
          standardizedValues = await deviationFromMean(values);
          break;
        case 'standardizeMAD':
          standardizedValues = await standardizeMAD(values);
          break;
        case 'rangeAdjust':
          standardizedValues = await rangeAdjust(values);
          break;
        case 'rangeStandardize':
          standardizedValues = await rangeStandardize(values);
          break;
        case 'standardize':
          standardizedValues = await standardize(values);
          break;
        default:
          throw new Error(
            `Invalid standardization method: ${standardizationMethod}`
          );
      }

      if (!standardizedValues) {
        throw new Error(
          `Failed to standardize the variable ${variableName} of dataset ${datasetName} using the ${standardizationMethod} method.`
        );
      }

      // create an output dataset name
      const outputDatasetName = `${standardizationMethod}_${generateId()}`;

      const outputVariableName = `${variableName}_${standardizationMethod}`;

      // create an output variable type
      const additionalData = {
        saveData: saveData ?? false,
        datasetName: outputDatasetName,
        originalDatasetName: datasetName,
        [outputDatasetName]: {
          type: 'columnData',
          content: {
            [outputVariableName]: values,
          },
        },
      };

      const llmResult = {
        success: true,
        details: `Standardized the variable ${variableName} of dataset ${datasetName} using the ${standardizationMethod} method. The result is stored in the dataset ${outputDatasetName}.`,
      };

      return {
        llmResult,
        additionalData,
      };
    } catch (error) {
      console.error('Error executing standardizeVariable tool:', error);
      return {
        llmResult: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  },
};

export type StandardizeVariableTool = typeof standardizeVariable;
