import { CustomFunctionCall } from '@openassistant/core';
import { ScatterplotOutputData } from './callback-function';
import { ResizablePlotContainer } from '../common/resizable-container';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScatterChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import {
  TooltipComponent,
  GridComponent,
  BrushComponent,
  ToolboxComponent,
} from 'echarts/components';
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
import { ScatterRegressionPlot } from './utils/scatter-regression-plot';
import { SimpleScatterPlot } from './utils/simple-scatter-plots';
import { RegressionResults } from '../math/linear-regression';
import {
  computeRegression,
  ComputeRegressionResult,
} from './utils/scatter-regression';

// Register the required ECharts components
echarts.use([
  TooltipComponent,
  GridComponent,
  ScatterChart,
  CanvasRenderer,
  BrushComponent,
  ToolboxComponent,
]);

export function scatterplotCallbackComponent(
  props: CustomFunctionCall
): JSX.Element | null {
  return (
    <ResizablePlotContainer>
      <ScatterplotComponent {...props} />
    </ResizablePlotContainer>
  );
}

export function ScatterplotComponent({
  output,
}: CustomFunctionCall): JSX.Element | null {
  const data = output.data as ScatterplotOutputData | undefined;

  const [showMore, setShowMore] = useState(false);

  // state for the filtered indexes: simple scatter plot will set this state and the regression plot will rerender based on this state
  const [filteredIndexes, setFilteredIndexes] = useState<number[]>(
    data?.filteredIndex ?? []
  );

  // state for regression results
  const [regressionResults, setRegressionResults] = useState<
    ComputeRegressionResult | undefined
  >(data?.regressionResults);

  // update regression results when filtered indexes change
  useEffect(() => {
    const newRegressionResults = computeRegression({
      xData: data?.xData ?? [],
      yData: data?.yData ?? [],
      filteredIndex: filteredIndexes,
    });
    setRegressionResults(newRegressionResults);
  }, [data?.xData, data?.yData, filteredIndexes]);

  // slope title
  const slopeTitle = useMemo(() => {
    if (!data?.regressionResults) return undefined;
    const slope = data.regressionResults.regression.slope.estimate;
    const pValue = data.regressionResults.regression.slope.pValue;
    return `- Slope: ${slope.toFixed(3)}${pValue < 0.01 ? '**' : pValue < 0.05 ? '*' : ''}`;
  }, [data?.regressionResults]);

  const handleMorePress = useCallback(() => {
    setShowMore(!showMore);
  }, [showMore]);

  const generateRegressionRows = (
    type: string,
    regressionData: RegressionResults
  ) => [
    <TableRow key={`${type.toLowerCase()}-intercept`}>
      <TableCell>{type}</TableCell>
      <TableCell>Intercept</TableCell>
      <TableCell>{regressionData.intercept.estimate.toFixed(4)}</TableCell>
      <TableCell>{regressionData.intercept.pValue.toFixed(4)}</TableCell>
      <TableCell>{regressionData.intercept.standardError.toFixed(4)}</TableCell>
      <TableCell>{regressionData.intercept.tStatistic.toFixed(4)}</TableCell>
    </TableRow>,
    <TableRow key={`${type.toLowerCase()}-slope`}>
      <TableCell>{type}</TableCell>
      <TableCell>Slope</TableCell>
      <TableCell>{regressionData.slope.estimate.toFixed(4)}</TableCell>
      <TableCell>{regressionData.slope.pValue.toFixed(4)}</TableCell>
      <TableCell>{regressionData.slope.standardError.toFixed(4)}</TableCell>
      <TableCell>{regressionData.slope.tStatistic.toFixed(4)}</TableCell>
    </TableRow>,
  ];

  if (!data || !data.xData || !data.yData) {
    return null;
  }

  return (
    <AutoSizer>
      {({ height, width }) => (
        <div style={{ height, width }}>
          <div className="h-full w-full flex flex-col rounded-lg bg-default-100 p-6 text-gray-900 shadow-secondary-1 dark:bg-gray-950 dark:text-gray-100">
            <div className="flex-col items-start p-2">
              <p className="text-tiny font-bold uppercase">Scatterplot</p>
              <small className="truncate text-default-500">
                {data?.xVariableName} vs {data?.yVariableName} {slopeTitle}
              </small>
            </div>
            <div className="relative h-full py-2 flex-grow dark:bg-black">
              <div className="absolute left-0 top-0 h-full w-full">
                <ScatterRegressionPlot
                  data={data}
                  filteredIndexes={filteredIndexes}
                />
              </div>
              <div className="absolute left-0 top-0 h-full w-full">
                <SimpleScatterPlot
                  datasetName={data.datasetName}
                  variableX={data.xVariableName}
                  xData={data.xData}
                  variableY={data.yVariableName}
                  yData={data.yData}
                  theme={data.theme}
                  onSelected={data.onSelected}
                  setFilteredIndexes={setFilteredIndexes}
                />
              </div>
            </div>
            <div className="footer text-xs">
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
                    showMore && (
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
              {showMore && data.regressionResults && (
                <div className="w-full text-tiny">
                  <div className="mb-2">
                    <small className="text-tiny text-default-500">
                      R² (All) ={' '}
                      {data.regressionResults.regression.rSquared.toFixed(4)}
                      {data.regressionResults.regressionSelected &&
                        ` | R² (Selected) = ${data.regressionResults.regressionSelected.rSquared.toFixed(4)}`}
                      {data.regressionResults.regressionUnselected &&
                        ` | R² (Unselected) = ${data.regressionResults.regressionUnselected.rSquared.toFixed(4)}`}
                    </small>
                  </div>
                  <Table
                    aria-label="Regression Results"
                    classNames={{
                      base: 'overflow-scroll p-0 m-0 text-tiny',
                      table: 'p-0 m-0 text-tiny',
                      wrapper: 'p-0 pr-2',
                      th: 'text-tiny',
                      td: 'text-[9px]',
                    }}
                    isCompact={true}
                    removeWrapper={true}
                  >
                    <TableHeader>
                      <TableColumn>Type</TableColumn>
                      <TableColumn>Parameter</TableColumn>
                      <TableColumn>p-Value</TableColumn>
                      <TableColumn>Estimate</TableColumn>
                      <TableColumn>Std. Error</TableColumn>
                      <TableColumn>t-Statistic</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {[
                        // All Data Results
                        ...generateRegressionRows(
                          'All',
                          data.regressionResults.regression
                        ),
                        // Selected Data Results
                        ...(regressionResults?.regressionSelected
                          ? generateRegressionRows(
                              'Selected',
                              regressionResults.regressionSelected
                            )
                          : []),
                        // Unselected Data Results
                        ...(regressionResults?.regressionUnselected
                          ? generateRegressionRows(
                              'Unselected',
                              regressionResults.regressionUnselected
                            )
                          : []),
                      ]}
                    </TableBody>
                  </Table>

                  {regressionResults?.chowResults && (
                    <div className="mt-2">
                      <small className="text-tiny text-default-500">
                        Chow test for sel/unsel regression subsets: distrib=F(2,{' '}
                        {data.yData.length - 4}
                        ), ratio=
                        {regressionResults.chowResults.fStat.toFixed(4)},
                        p-val=
                        {regressionResults.chowResults.pValue.toFixed(4)}
                      </small>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AutoSizer>
  );
}
