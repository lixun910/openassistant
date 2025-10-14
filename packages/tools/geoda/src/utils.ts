// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { WeightsMeta } from '@geoda/core';

import { getCachedWeightsById } from './weights/tool';
import { SpatialToolContext } from './types';

export function isSpatialToolContext(
  context: unknown
): context is SpatialToolContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getGeometries' in context
  );
}

export type PreviousExecutionOutput = {
  data?: {
    weights?: number[][];
    weightsMeta?: WeightsMeta;
  };
}[];

export function getWeights(
  weightsId: string | undefined
): { weights: number[][] | null; weightsMeta: WeightsMeta | null } {
  let weights: number[][] | null = null;
  let weightsMeta: WeightsMeta | null = null;

  if (weightsId) {
    // Try to get weights from cache
    const existingWeights = getCachedWeightsById(weightsId);
    if (existingWeights) {
      weights = existingWeights.weights;
      weightsMeta = existingWeights.weightsMeta;
    }
  }

  return { weights, weightsMeta };
}
