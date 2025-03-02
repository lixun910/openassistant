import { useCallback, DragEvent } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
  Button,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from '@nextui-org/react';
import { Icon } from '@iconify/react';
import { Boxplot, BoxplotOutputData } from './box-plot';
import { BoxplotDataProps } from './utils';
import { ExpandableContainer } from '@openassistant/common';

/**
 * BoxplotComponentContainer for rendering box plot visualizations with expandable container.
 * With expandable container, the box plot can be:
 * - expanded to a modal dialog with box plots rendered in vertical direction and with detailed statistics table.
 * - dragged and dropped to other places.
 * - resized.
 * - have a tooltip with detailed statistics.
 *
 * @param props {@link BoxplotOutputData} Configuration and data for the box plot
 * @returns Box plot visualization with optional detailed statistics table
 */
export function BoxplotComponentContainer(
  props: BoxplotOutputData
): JSX.Element | null {
  const onDragStart = (e: DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        id: props.id,
        type: 'boxplot',
        data: props,
      })
    );

    // prevent the event from propagating
    e.stopPropagation();
  };

  return (
    <ExpandableContainer
      defaultWidth={600}
      defaultHeight={800}
      draggable={props.isDraggable || false}
      onDragStart={onDragStart}
    >
      <BoxplotComponent {...props} />
    </ExpandableContainer>
  );
}

/**
 * Component that renders a box plot visualization with optional expanded statistics table.
 * See {@link BoxplotComponentContainer} for detailed usage and features.
 *
 * @param props {@link BoxplotOutputData} Configuration and data for the box plot
 * @returns Box plot visualization with optional detailed statistics table
 */
export function BoxplotComponent(props: BoxplotOutputData): JSX.Element | null {
  const handleMorePress = useCallback(() => {
    props.setIsExpanded?.(true);
  }, [props]);

  /**
   * Creates table cells for a given metric and boxplot data
   *
   * @param metric - Statistical metric to display (e.g. 'low', 'q1', 'mean')
   * @param boxplotData - Data containing boxplot statistics
   * @returns Array of table cells with formatted metric values
   */
  const createTableCells = (metric: string, boxplotData: BoxplotDataProps) => {
    const tableCells: JSX.Element[] = [];
    tableCells.push(<TableCell key="metric-label">{metric}</TableCell>);
    boxplotData.boxplots.forEach((boxplot) => {
      tableCells.push(
        <TableCell key={boxplot.name}>{boxplot[metric].toFixed(4)}</TableCell>
      );
    });
    return tableCells;
  };

  /**
   * Generates table rows for all boxplot statistics
   *
   * @param boxplotData - Data containing boxplot statistics
   * @returns Array of table rows with statistical metrics
   */
  const generateStatsRows = (boxplotData: BoxplotDataProps) => {
    const metrics = ['low', 'q1', 'q2', 'q3', 'high', 'mean', 'std', 'iqr'];

    return metrics.map((metric, index) => (
      <TableRow key={`${metric.toLowerCase()}-stats-${index}`}>
        {createTableCells(metric, boxplotData)}
      </TableRow>
    ));
  };

  return (
    <AutoSizer>
      {({ height, width }) => (
        <div
          style={{ height: Math.max(height, 200), width }}
          className="relative"
        >
          <div className="h-full w-full flex flex-col rounded-lg gap-2 shadow-secondary-1 dark:text-gray-100">
            <div className="relative h-full py-2 flex-grow">
              <div className="absolute left-0 top-0 h-full w-full">
                <Boxplot {...props} />
              </div>
            </div>
            <div className="footer text-xs">
              {!props.isExpanded && (
                <div className="flex w-full justify-end">
                  <Button
                    size="sm"
                    variant="light"
                    startContent={
                      <Icon
                        icon="material-symbols-light:query-stats"
                        width="18"
                        height="18"
                      />
                    }
                    endContent={
                      props.isExpanded && (
                        <Icon
                          icon="solar:alt-arrow-up-line-duotone"
                          width="18"
                          height="18"
                        />
                      )
                    }
                    onPress={handleMorePress}
                  >
                    More
                  </Button>
                </div>
              )}
              {props.isExpanded && (
                <div className="w-full text-tiny">
                  <Table
                    aria-label="Box Plot Statistics"
                    classNames={{
                      base: 'overflow-scroll p-0 m-0 text-tiny',
                      table: 'p-0 m-0 text-tiny',
                      wrapper: 'p-0 pr-2',
                      th: 'text-tiny',
                      td: 'text-tiny text-default-500',
                    }}
                    isCompact={true}
                    removeWrapper={true}
                  >
                    <TableHeader>
                      <>
                        <TableColumn key="metric"> </TableColumn>
                        {props.variables.map((variable) => (
                          <TableColumn key={variable}>{variable}</TableColumn>
                        ))}
                      </>
                    </TableHeader>
                    <TableBody>
                      {generateStatsRows(props.boxplotData)}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AutoSizer>
  );
}
