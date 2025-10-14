export type OsmToolContext = {
  getGeometries: (datasetName: string) => Promise<unknown>;
};

export function isOsmToolContext(context: unknown): context is OsmToolContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getGeometries' in context
  );
}

export type MapboxToolContext = {
  getMapboxToken: () => string;
};

export function isMapboxToolContext(
  context: unknown
): context is MapboxToolContext {
  return (
    typeof context === 'object' &&
    context !== null &&
    'getMapboxToken' in context
  );
}
