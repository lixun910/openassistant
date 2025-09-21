// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OpenAssistantTool, generateId, z } from '@openassistant/utils';

import { BoxplotDataProps, createBoxplot } from './utils';
import {
  EChartsToolContext,
  isEChartsToolContext,
  OnSelected,
} from '../../types';

/**
 * The boxplot tool is used to create a box plot for a given dataset and variable.
 *
 * **Example user prompts:**
 * - "Can you create a box plot of the revenue per capita for each location in dataset myVenues?"
 * - "Can you show a box plot of the revenue per capita for each location in dataset myVenues?"
 *
 * @example
 * ```typescript
 * import { boxplot, BoxplotTool } from '@openassistant/plots';
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
 *   // render the boxplot using <BoxplotComponentContainer props={additionalData} />
 * };
 *
 * const boxplotTool: BoxplotTool = {
 *   ...boxplot,
 *   context: toolContext,
 *   onToolCompleted,
 * };
 *
 * generateText({
 *   model: openai('gpt-4o-mini', { apiKey: key }),
 *   prompt: 'Can you create a box plot of the revenue per capita for each location in dataset myVenues?',
 *   tools: {
 *     boxplot: convertToVercelAiTool(boxplotTool),
 *   },
 * });
 * ```
 */
export class BoxplotTool extends OpenAssistantTool<typeof BoxplotArgs> {
  constructor(
    context: EChartsToolContext = {
      getValues: () => {
        throw new Error('getValues() of BoxplotTool is not implemented');
      },
      onSelected: () => {},
      config: {
        isDraggable: false,
      },
    },
    component?: React.ReactNode,
    onToolCompleted?: (toolCallId: string, additionalData?: unknown) => void
  ) {
    super(
      'create a boxplot chart',
      BoxplotArgs,
      context,
      component,
      onToolCompleted
    );
  }

  async execute(
    params: z.infer<typeof BoxplotArgs>,
    options?: { context?: Record<string, unknown> }
  ): Promise<ExecuteBoxplotResult> {
    return executeBoxplot(params, options);
  }
}

export const BoxplotArgs = z.object({
  datasetName: z.string().describe('The name of the dataset.'),
  variableNames: z
    .array(z.string())
    .describe('The names of the variables to use in the chart.'),
  boundIQR: z
    .number()
    .optional()
    .describe(
      'The bound of the Interquartile Range (IQR). The default value is 1.5'
    ),
});

// For backward compatibility, create a default instance
export const boxplot = new BoxplotTool();

// Export the class as the main type
export type { BoxplotTool };

// Legacy type for backward compatibility
export type BoxplotToolArgs = z.ZodObject<{
  datasetName: z.ZodString;
  variableNames: z.ZodArray<z.ZodString>;
  boundIQR: z.ZodOptional<z.ZodNumber>;
}>;

export type BoxplotLlmResult = {
  success: boolean;
  result?: {
    id: string;
    boxplotData: BoxplotDataProps;
    boundIQR: number;
    datasetName: string;
  };
  error?: string;
  instruction?: string;
};

export type BoxplotAdditionalData = {
  id: string;
  datasetName: string;
  variables: string[];
  boxplotData: BoxplotDataProps;
  boundIQR: number;
  data?: Record<string, number[]>;
  theme?: string;
  isDraggable?: boolean;
  isExpanded?: boolean;
  onSelected?: OnSelected;
};

/**
 * The result of the boxplot tool.
 */
export type ExecuteBoxplotResult = {
  llmResult: BoxplotLlmResult;
  additionalData?: BoxplotAdditionalData;
};

async function executeBoxplot(
  params: z.infer<typeof BoxplotArgs>,
  options?: { context?: Record<string, unknown> }
): Promise<ExecuteBoxplotResult> {
  const { datasetName, variableNames, boundIQR = 1.5 } = params;
  try {
    if (!isEChartsToolContext(options.context)) {
      throw new Error('Invalid context');
    }
    const { getValues, onSelected, config } = options.context;

    const data = {};
    await Promise.all(
      variableNames.map(async (variable) => {
        const values = await getValues(datasetName, variable);
        data[variable] = values;
      })
    );

    // create boxplot data
    const boxplotData: BoxplotDataProps = createBoxplot({
      data,
      boundIQR,
    });

    const boxplotId = generateId();

    return {
      llmResult: {
        success: true,
        result: {
          id: boxplotId,
          boxplotData,
          boundIQR,
          datasetName,
        },
      },
      additionalData: {
        id: boxplotId,
        datasetName,
        variables: variableNames,
        boxplotData,
        boundIQR,
        data,
        theme: config?.theme || 'light',
        isDraggable: config?.isDraggable || false,
        isExpanded: config?.isExpanded || false,
        onSelected,
      },
    };
  } catch (error) {
    console.error('Error executing boxplot:', error);
    return {
      llmResult: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        instruction:
          'Try to fix the error and create a boxplot. If the error persists, pause the execution and ask the user to try with different prompt and context.',
      },
    };
  }
}
