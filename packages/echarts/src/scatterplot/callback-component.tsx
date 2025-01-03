import { CustomFunctionCall } from '@openassistant/core';
import { ScatterplotComponent } from './utils/scatter-plot-component';
import { ScatterplotOutputData } from './callback-function';
import { ExpandableContainer } from '../common/expandable-container';

// type guard
function isScatterplotOutputData(data: unknown): data is ScatterplotOutputData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'xData' in data &&
    'yData' in data &&
    'xVariableName' in data &&
    'yVariableName' in data &&
    'datasetName' in data
  );
}

export function ScatterplotCallbackComponent(
  props: CustomFunctionCall
): JSX.Element | null {
  const data = props.output.data as ScatterplotOutputData | undefined;

  if (!data || !isScatterplotOutputData(data)) {
    return null;
  }

  return (
    <ExpandableContainer defaultWidth={600} defaultHeight={800}>
      <ScatterplotComponent {...data} />
    </ExpandableContainer>
  );
}
