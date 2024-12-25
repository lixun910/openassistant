import {
  CallbackFunctionProps,
  CustomFunctionContext,
  CustomFunctionOutputProps,
  ErrorCallbackResult,
  RegisterFunctionCallingProps,
} from '@openassistant/core';
import { histogramCallbackMessage, HistogramDataProps } from './histogram-plot';

/**
 * The function of getting the values of a variable from the dataset.
 * @param datasetName - The name of the dataset.
 * @param variableName - The name of the variable.
 * @returns The values of the variable.
 */
export type GetValues = (datasetName: string, variableName: string) => number[];

/**
 * The callback function can be used to sync the selections of the histogram plot with the original dataset.
 * @param datasetName - The name of the dataset.
 * @param selectedIndices - The indices of the selected bars in the histogram plot.
 */
export type OnSelectedCallback = (
  datasetName: string,
  selectedIndices: number[]
) => void;

/**
 * The context of the histogram function.
 * @param getValues - Get the values of a variable from the dataset. See {@link GetValues} for more details.
 * @param onSelected - The callback function can be used to sync the selections of the histogram plot with the original dataset. See {@link OnSelectedCallback} for more details.
 */
export type HistogramFunctionContext = {
  getValues: GetValues;
  onSelected?: OnSelectedCallback;
  theme?: string;
};

type ValueOf<T> = T[keyof T];
type HistogramFunctionContextValues = ValueOf<HistogramFunctionContext>;

/**
 * Define the histogram function. This function can assist user to create a histogram plot using the values of a variable in the dataset.
 * The values should be retrieved using the getValues() callback function.
 *
 * User can select the bars in the histogram plot, and the selections can be synced back to the original dataset using the onSelected() callback.
 * See {@link OnSelectedCallback} for more details.
 *
 * @param context - The context of the function. See {@link HistogramFunctionContext} for more details.
 * @param context.getValues - Get the values of a variable from the dataset. See {@link GetValues} for more details.
 * @param context.onSelected - The callback function can be used to sync the selections of the histogram plot with the original dataset. See {@link OnSelectedCallback} for more details.
 * @returns The function definition.
 */
export function histogramFunctionDefinition(
  context: CustomFunctionContext<HistogramFunctionContextValues>
): RegisterFunctionCallingProps {
  return {
    name: 'histogram',
    description: 'Create a histogram plot',
    properties: {
      datasetName: {
        type: 'string',
        description:
          'The name of the dataset to create a histogram plot. If not provided, use the first dataset or ask user to select or upload a dataset.',
      },
      variableName: {
        type: 'string',
        description: 'The name of the variable to create a histogram plot',
      },
      numberOfBins: {
        type: 'number',
        description:
          'The number of bins to create in the histogram. Default value is 5.',
      },
    },
    required: ['datasetName', 'variableName'],
    callbackFunction: histogramCallbackFunction,
    callbackFunctionContext: context,
    callbackMessage: histogramCallbackMessage,
  };
}

type HistogramFunctionArgs = {
  datasetName: string;
  variableName: string;
  numberOfBins: number;
};

export type HistogramOuputData = {
  datasetName: string;
  variableName: string;
  histogramData: HistogramDataProps[];
  barDataIndexes: number[][];
  onSelected?: (datasetName: string, selectedIndices: number[]) => void;
  theme?: string;
};

type HistogramOutputResult =
  | ErrorCallbackResult
  | {
      success: boolean;
      variableName: string;
      details: string;
    };

function histogramCallbackFunction({
  functionName,
  functionArgs,
  functionContext,
}: CallbackFunctionProps): CustomFunctionOutputProps<
  HistogramOutputResult,
  HistogramOuputData
> {
  const { datasetName, variableName, numberOfBins } =
    functionArgs as HistogramFunctionArgs;

  if (!datasetName || !variableName) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: 'Dataset name and variable name are required.',
      },
    };
  }

  const { getValues, onSelected, theme } = functionContext as HistogramFunctionContext;

  let values;

  try {
    values = getValues(datasetName, variableName);
  } catch (error) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: `Failed to get values from dataset. ${error}`,
      },
    };
  }

  try {
    // create histogram bins
    const { counts, breaks, histogramData, barDataIndexes } =
      createHistogramBins(values, numberOfBins);

    return {
      type: 'plot',
      name: functionName,
      result: {
        success: true,
        variableName,
        details: `Histogram with ${numberOfBins} bins has been created. The bin breaks are ${breaks.join(
          ', '
        )}. The counts for each bin are ${counts.join(', ')}.`,
      },
      data: {
        datasetName,
        variableName,
        histogramData,
        barDataIndexes,
        onSelected,
        theme,
      },
    };
  } catch (error) {
    return {
      type: 'error',
      name: functionName,
      result: {
        success: false,
        details: `Failed to create histogram. ${error}`,
      },
    };
  }
}

function createHistogramBins(
  values: number[],
  numberOfBins: number = 5
): {
  counts: number[];
  indices: number[][];
  breaks: number[];
  histogramData: HistogramDataProps[];
  barDataIndexes: number[][];
} {
  if (!values.length) {
    return {
      counts: [],
      indices: [],
      breaks: [],
      histogramData: [],
      barDataIndexes: [],
    };
  }

  // Find min and max values
  const min = Math.min(...values);
  const max = Math.max(...values);

  // Calculate bin width
  const binWidth = (max - min) / numberOfBins;

  // Create breaks array
  const breaks = Array.from(
    { length: numberOfBins + 1 },
    (_, i) => min + i * binWidth
  );

  // Initialize arrays
  const counts = new Array(numberOfBins).fill(0);
  const indices = Array.from({ length: numberOfBins }, () => [] as number[]);
  const histogramData: HistogramDataProps[] = [];

  // Create histogram data structure
  for (let i = 0; i < numberOfBins; i++) {
    histogramData.push({
      bin: i,
      binStart: breaks[i],
      binEnd: breaks[i + 1],
    });
  }

  // Count values and store indices in each bin
  values.forEach((value, index) => {
    // Handle edge case for maximum value
    if (value === max) {
      counts[numberOfBins - 1]++;
      indices[numberOfBins - 1].push(index);
      return;
    }

    const binIndex = Math.floor((value - min) / binWidth);
    counts[binIndex]++;
    indices[binIndex].push(index);
  });

  return {
    counts,
    indices,
    breaks,
    histogramData,
    barDataIndexes: indices, // reuse indices array for barDataIndexes
  };
}
