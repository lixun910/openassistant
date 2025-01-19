import { CustomFunctionCall } from '@openassistant/core';
import { KeplerGlComponentWithProvider } from './component/keplergl-component';
import { FileCacheItem } from '@kepler.gl/processors';
import { ExpandableContainer } from '@openassistant/common';

export type CreateMapOutputData = {
  datasetName: string;
  datasetForKepler: FileCacheItem[];
  theme?: string;
};

// type guard
function isCreateMapOutputData(data: unknown): data is CreateMapOutputData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'datasetName' in data &&
    'datasetForKepler' in data
  );
}

export function CreateMapCallbackComponent(props: CustomFunctionCall) {
  const data = props.output.data as CreateMapOutputData | undefined;

  if (!data || !isCreateMapOutputData(data)) {
    return null;
  }

  return (
    <ExpandableContainer defaultWidth={600} defaultHeight={800}>
      <KeplerGlComponentWithProvider {...data} />
    </ExpandableContainer>
  );
}
