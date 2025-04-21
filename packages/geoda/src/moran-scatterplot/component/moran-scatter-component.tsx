import { ExpandableContainer, generateId } from '@openassistant/common';
import {
  MoranScatterComponent,
  MoranScatterOutputData,
} from './moran-scatter-plot';
import { useState } from 'react';
import { useDraggable } from '@openassistant/common';

export function MoranScatterPlotToolComponent(props: MoranScatterOutputData) {
  const [isExpanded, setIsExpanded] = useState(props.isExpanded);

  const onDragStart = useDraggable({
    id: props.id || generateId(),
    type: 'bubble',
    data: props,
  });

  const onExpanded = (flag: boolean) => {
    setIsExpanded(flag);
  };

  return (
    <ExpandableContainer
      defaultWidth={isExpanded ? 600 : undefined}
      defaultHeight={isExpanded ? 800 : 400}
      draggable={props.isDraggable || false}
      onDragStart={onDragStart}
      onExpanded={onExpanded}
    >
      <MoranScatterComponent {...props} />
    </ExpandableContainer>
  );
}
