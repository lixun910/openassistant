import {
  Button,
  PopoverContent,
  PopoverTrigger,
  useDraggable,
} from '@nextui-org/react';
import { cloneElement, useRef, useState } from 'react';
import { ResizablePlotContainer } from './resizable-container';
import { Popover } from '@nextui-org/react';
import { Icon } from '@iconify/react';

export function ExpandableContainer({
  children,
  defaultWidth = 600,
  defaultHeight = 800,
}: {
  children: JSX.Element;
  defaultWidth?: number;
  defaultHeight?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const targetRef = useRef(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isExpanded });

  const onExpandComponent = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <ResizablePlotContainer>
      <div
        className={`h-full w-full relative rounded-md${
          isExpanded ? ' border border-default-200 p-1' : ''
        }`}
      >
        {!isExpanded && children}
        <div className="absolute top-0 right-0 mt-2 mr-2 cursor-pointer">
          <Popover
            isOpen={isExpanded}
            placement="left"
            offset={100}
            ref={targetRef}
          >
            <PopoverTrigger>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onClick={onExpandComponent}
              >
                <Icon
                  icon={
                    isExpanded
                      ? 'material-symbols-light:collapse-content-rounded'
                      : 'ci:expand'
                  }
                  width="12"
                  height="12"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="h-3 w-full" {...moveProps}></div>
              <ResizablePlotContainer
                defaultHeight={defaultHeight}
                defaultWidth={defaultWidth}
              >
                <div className="h-full w-full relative">
                  {cloneElement(children, { isExpanded: true })}
                  <Button
                    className="absolute top-0 right-0"
                    isIconOnly
                    size="sm"
                    variant="light"
                    onClick={onExpandComponent}
                  >
                    <Icon
                      icon="material-symbols-light:collapse-content-rounded"
                      width="16"
                      height="16"
                    />
                  </Button>
                </div>
              </ResizablePlotContainer>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </ResizablePlotContainer>
  );
}
