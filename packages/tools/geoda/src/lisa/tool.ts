// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import {
  OpenAssistantTool,
  OpenAssistantExecuteFunctionResult,
  generateId,
} from '@openassistant/utils';
import { z } from 'zod';
import {
  localMoran,
  localGeary,
  localG,
  localGStar,
  quantileLisa,
  LocalMoranResult,
} from '@geoda/lisa';

import { GetGeometries, GetValues } from '../types';
import { getWeights } from '../utils';
import { appendJoinValuesToGeometries } from '../spatial_join/tool';

export type LisaFunctionArgs = z.ZodObject<{
  method: z.ZodEnum<{
    localMoran: 'localMoran';
    localGeary: 'localGeary';
    localG: 'localG';
    localGStar: 'localGStar';
    quantileLisa: 'quantileLisa';
  }>;
  weightsID: z.ZodOptional<z.ZodString>;
  variableName: z.ZodString;
  multiVariableNames: z.ZodOptional<z.ZodArray<z.ZodString>>;
  biVariableNames: z.ZodOptional<z.ZodArray<z.ZodString>>;
  permutation: z.ZodOptional<z.ZodNumber>;
  significanceThreshold: z.ZodOptional<z.ZodNumber>;
  datasetName: z.ZodString;
  k?: z.ZodOptional<z.ZodNumber>;
  quantile?: z.ZodOptional<z.ZodNumber>;
  mapBounds?: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
}>;

export type LisaLlmResult = {
  success: boolean;
  globalMoranI?: number;
  clusterColorAndLabels?: Array<{
    value: number;
    label: string;
    color: string;
    numberOfObservations: number;
  }>;
  error?: string;
  instructions?: string;
  datasetName?: string;
};

export type LisaAdditionalData = Partial<LocalMoranResult> & {
  datasetName: string;
  originalDatasetName: string;
  significanceThreshold: number;
};

export type LisaFunctionContext = {
  getValues: GetValues;
  getGeometries?: GetGeometries;
};

/**
 * ## lisa Tool
 *
 * This tool applies Local Indicators of Spatial Association (LISA) statistics to identify local clusters and spatial outliers.
 * It helps detect areas where similar values cluster together or where outliers exist in the spatial distribution.
 *
 * ### LISA Methods
 *
 * The LISA method can be one of the following types:
 * - **localMoran**: Local Moran's I statistic for detecting clusters and outliers
 * - **localGeary**: Local Geary's C statistic for detecting spatial heterogeneity
 * - **localG**: Local Getis-Ord G statistic for detecting hot and cold spots
 * - **localGStar**: Local Getis-Ord G* statistic (includes the observation itself)
 * - **quantileLisa**: Quantile-based LISA analysis
 *
 * ### Parameters
 * - `datasetName`: Name of the dataset containing the variable
 * - `variableName`: Name of the numerical variable to analyze
 * - `method`: LISA method to use (see above)
 * - `weightsID`: ID of spatial weights matrix (optional, will use cached weights if available)
 * - `permutation`: Number of permutations for significance testing (default: 999)
 * - `significanceThreshold`: Significance threshold for filtering results (default: 0.05)
 * - `k`: Number of quantiles for quantile LISA (required for quantileLisa method)
 * - `quantile`: Quantile value for quantile LISA (required for quantileLisa method)
 *
 * **Example user prompts:**
 * - "Are young population clustering over the zipcode areas?"
 * - "Can you perform a local Moran's I analysis on the population data?"
 * - "What are the local clusters in the population data?"
 * - "How many significant clusters are there in the population data?"
 *
 * ### Example
 * ```typescript
 * import { lisa } from "@openassistant/geoda";
 * import { convertToVercelAiTool } from "@openassistant/utils";
 *
 * const lisaTool = {
 *   ...lisa,
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
 *   prompt: 'Can you perform a local Moran analysis on the population data?',
 *   tools: { lisa: convertToVercelAiTool(lisaTool) },
 * });
 * ```
 *
 * :::note
 * The LISA tool should always be used with the spatialWeights tool. The LLM models know how to use the spatialWeights tool for the LISA analysis.
 * :::
 */
export const lisa: OpenAssistantTool<
  LisaFunctionArgs,
  LisaLlmResult,
  LisaAdditionalData,
  LisaFunctionContext
> = {
  name: 'lisa',
  description:
    'Apply local indicators of spatial association (LISA) statistics to identify local clusters and spatial outliers.',
  parameters: z.object({
    method: z
      .enum([
        'localMoran',
        'localGeary',
        'localG',
        'localGStar',
        'quantileLisa',
      ])
      .describe('The name of the LISA method'),
    weightsID: z
      .string()
      .optional()
      .describe('The weightsID of the spatial weights'),
    variableName: z.string(),
    multiVariableNames: z
      .array(z.string())
      .optional()
      .describe('A list of variable names for localGeary and quantileLisa'),
    biVariableNames: z
      .array(z.string())
      .optional()
      .describe('A list of two variable names for bivariateLocalMoran'),
    permutation: z
      .number()
      .optional()
      .describe('The number of permutations used in LISA computation'),
    significanceThreshold: z
      .number()
      .optional()
      .describe(
        'The significance threshold used to filter out insignificant clusters'
      ),
    datasetName: z.string(),
    k: z
      .number()
      .optional()
      .describe('The number of quantiles for quantile LISA'),
    quantile: z
      .number()
      .optional()
      .describe('The quantile value for quantile LISA'),
    mapBounds: z.array(z.number()).optional(),
  }),
  execute: executeLisa,
  context: {
    getValues: () => {
      throw new Error('getValues() of LisaTool is not implemented');
    },
  },
};

export type LisaTool = typeof lisa;

type LisaArgs = {
  method: string;
  weightsID: string;
  variableName: string;
  multiVariableNames?: string[];
  biVariableNames?: string[];
  permutation?: number;
  significanceThreshold?: number;
  datasetName: string;
  k?: number;
  quantile?: number;
  mapBounds?: number[];
};

function isLisaArgs(args: unknown): args is LisaArgs {
  return (
    typeof args === 'object' &&
    args !== null &&
    'method' in args &&
    typeof args.method === 'string' &&
    'variableName' in args &&
    typeof args.variableName === 'string' &&
    'datasetName' in args &&
    typeof args.datasetName === 'string'
  );
}

function isLisaContext(context: unknown): context is LisaFunctionContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getValues' in context &&
    typeof context.getValues === 'function'
  );
}

async function executeLisa(
  args: z.infer<LisaFunctionArgs>,
  options?: {
    toolCallId: string;
    abortSignal?: AbortSignal;
    context?: LisaFunctionContext;
    previousExecutionOutput?: unknown[];
  }
): Promise<
  OpenAssistantExecuteFunctionResult<LisaLlmResult, LisaAdditionalData>
> {
  try {
    if (!isLisaArgs(args)) {
      throw new Error('Invalid arguments for lisa tool');
    }

    if (!options?.context || !isLisaContext(options.context)) {
      throw new Error('Invalid context for lisa tool');
    }

    const {
      method,
      weightsID,
      variableName,
      permutation = 999,
      significanceThreshold = 0.05,
      datasetName,
      k,
      quantile,
      mapBounds,
    } = args;
    const { getValues, getGeometries } = options.context;

    // Get weights if needed
    const { weights } = getWeights(weightsID);

    if (!weights) {
      throw new Error('Weights are required for LISA analysis');
    }

    const values = await getValues(datasetName, variableName);

    let lisaFunction = localMoran;
    let globalMoranI: number | null = null;

    if (method === 'localMoran') {
      lisaFunction = localMoran;
    } else if (method === 'localGeary') {
      lisaFunction = localGeary;
    } else if (method === 'localG') {
      lisaFunction = localG;
    } else if (method === 'localGStar') {
      lisaFunction = localGStar;
    } else if (method === 'quantileLisa') {
      if (!k || !quantile) {
        throw new Error('k and quantile are required for quantile LISA');
      }
      lisaFunction = (params) => quantileLisa({ ...params, k, quantile });
    } else {
      throw new Error('Invalid method for lisa tool');
    }

    // run LISA analysis
    const lm = await lisaFunction({
      data: values as number[],
      neighbors: weights,
      permutation,
      significanceCutoff: significanceThreshold,
    });

    // calculate global Moran's I
    if (method === 'localMoran') {
      globalMoranI =
        lm.lisaValues.reduce((a, b) => a + b, 0) / lm.lisaValues.length;
    }

    // color and label for each cluster
    const clusterColorAndLabels = lm.labels.map((label, i) => {
      return {
        value: i,
        label,
        color: lm.colors[i],
        numberOfObservations: lm.clusters.filter((c) => c === i).length,
      };
    });

    // create a lisa dataset name
    const lisaDatasetName = `${method}_${generateId()}`;
    let lisaGeoJson: GeoJSON.FeatureCollection | null = null;

    const additionalData: LisaAdditionalData = {
      originalDatasetName: datasetName,
      datasetName: lisaDatasetName,
      significanceThreshold,
      clusters: lm.clusters,
      lagValues: lm.lagValues,
      pValues: lm.pValues,
      lisaValues: lm.lisaValues,
      sigCategories: lm.sigCategories,
      nn: lm.nn,
      labels: lm.labels,
      colors: lm.colors,
    };

    // no need to create a new dataset if getGeometries() is not provided
    if (getGeometries) {
      // create lisa result by appending lm to geometries
      const geometries = await getGeometries(datasetName);
      // create Record<string, number[]> from lm
      const featureValues = {
        [variableName]: values,
        lisa: lm.lisaValues,
        sigCategories: lm.sigCategories,
        clusters: lm.clusters,
        pValues: lm.pValues,
        lagValues: lm.lagValues,
        nn: lm.nn,
      };
      // @ts-expect-error - Support append lisa results to ArcLayer data
      lisaGeoJson = appendJoinValuesToGeometries(geometries, featureValues);
      // append lisaGeoJson to additionalData
      additionalData[lisaDatasetName] = {
        type: 'geojson',
        content: lisaGeoJson,
      };
    }

    return {
      llmResult: {
        success: true,
        ...(mapBounds ? { mapBounds } : {}),
        ...(globalMoranI ? { globalMoranI } : {}),
        datasetName: lisaDatasetName,
        clusterColorAndLabels,
        instructions: `When creating a unique value map for LISA analysis:
- Please use 'clusters' as the color field
- Please use the colors from result.clusters.colors
IMPORTANT: please use dataClassify tool to get unique values for the color field
`,
      },
      additionalData,
    };
  } catch (error) {
    console.error('Error in lisa tool', error);
    return {
      llmResult: {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
}
