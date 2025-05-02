/**
 * The getValues function is used to get the values of the variable from dataset.
 */
export type GetValues = (
  /**
   * The name of the dataset.
   */
  datasetName: string,
  /**
   * The name of the variable.
   */
  variableName: string
) => Promise<number[]>;

/**
 * The onSelected function is used to handle the selected indices of the histogram.
 */
export type OnSelected = (
  /**
   * The name of the dataset.
   */
  datasetName: string,
  /**
   * The selected indices of the histogram.
   */
  selectedIndices: number[]
) => void;
