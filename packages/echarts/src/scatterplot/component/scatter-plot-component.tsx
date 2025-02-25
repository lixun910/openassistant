import { ScatterplotOutputData } from '../callback-function';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { ScatterRegressionPlot } from './scatter-regression-plot';
import { SimpleScatterPlot } from './simple-scatter-plots';
import { RegressionResults } from '../../math/linear-regression';
import {
  computeRegression,
  ComputeRegressionResult,
} from './scatter-regression';

export function ScatterplotComponent({
  id,
  datasetName,
  filteredIndex,
  regressionResults: regression,
  xData,
  yData,
  xVariableName,
  yVariableName,
  onSelected,
  theme,
  isExpanded = false,
  setIsExpanded,
}: ScatterplotOutputData): JSX.Element | null {
  const [showMore, setShowMore] = useState(isExpanded);

  // state for the filtered indexes: simple scatter plot will set this state and the regression plot will rerender based on this state
  const [filteredIndexes, setFilteredIndexes] = useState<number[]>(
    filteredIndex ?? []
  );

  // state for regression results
  const [regressionResults, setRegressionResults] = useState<
    ComputeRegressionResult | undefined
  >(regression);

  // update regression results when filtered indexes change
  useEffect(() => {
    const newRegressionResults = computeRegression({
      xData: xData ?? [],
      yData: yData ?? [],
      filteredIndex: filteredIndexes,
    });
    setRegressionResults(newRegressionResults);
  }, [xData, yData, filteredIndexes]);

  // slope title
  const slopeTitle = useMemo(() => {
    if (!regression) return undefined;
    const slope = regression.regression.slope.estimate;
    const pValue = regression.regression.slope.pValue;
    return `- Slope: ${slope.toFixed(3)}${pValue < 0.01 ? '**' : pValue < 0.05 ? '*' : ''}`;
  }, [regression]);

  const handleMorePress = useCallback(() => {
    setShowMore(!showMore);
    setIsExpanded?.(!isExpanded);
  }, [showMore, isExpanded, setIsExpanded]);

  const generateRegressionRows = (
    type: string,
    regressionData?: RegressionResults
  ) => [
    <TableRow key={`${type.toLowerCase()}-intercept`}>
      <TableCell>{type}: Intercept</TableCell>
      <TableCell>
        {regressionData ? regressionData.intercept.estimate.toFixed(4) : 'N/A'}
      </TableCell>
      <TableCell>
        {regressionData ? regressionData.intercept.pValue.toFixed(4) : 'N/A'}
      </TableCell>
      <TableCell>
        {regressionData
          ? regressionData.intercept.standardError.toFixed(4)
          : 'N/A'}
      </TableCell>
      <TableCell>
        {regressionData
          ? regressionData.intercept.tStatistic.toFixed(4)
          : 'N/A'}
      </TableCell>
    </TableRow>,
    <TableRow key={`${type.toLowerCase()}-slope`}>
      <TableCell>{type}: Slope</TableCell>
      <TableCell>
        {regressionData ? regressionData.slope.estimate.toFixed(4) : 'N/A'}
      </TableCell>
      <TableCell>
        {regressionData ? regressionData.slope.pValue.toFixed(4) : 'N/A'}
      </TableCell>
      <TableCell>
        {regressionData ? regressionData.slope.standardError.toFixed(4) : 'N/A'}
      </TableCell>
      <TableCell>
        {regressionData ? regressionData.slope.tStatistic.toFixed(4) : 'N/A'}
      </TableCell>
    </TableRow>,
  ];

  return (
    <AutoSizer>
      {({ height, width }) => (
        <div style={{ height, width }} className="relative">
          <div className="h-full w-full flex flex-col rounded-lg p-6 text-gray-900 shadow-secondary-1 dark:bg-gray-950 dark:text-gray-100">
            <div className="flex-col items-start p-2">
              <p className="text-tiny font-bold uppercase">Scatterplot</p>
              <small className="truncate text-default-500">
                {xVariableName} vs {yVariableName} {slopeTitle}
              </small>
            </div>
            <div className="relative h-full py-2 flex-grow dark:bg-black">
              <div className="absolute left-0 top-0 h-full w-full">
                <ScatterRegressionPlot
                  filteredIndex={filteredIndex}
                  regressionResults={regressionResults}
                  xData={xData}
                  yData={yData}
                  showLoess={false}
                  showRegressionLine={true}
                  theme={theme}
                  filteredIndexes={filteredIndexes}
                />
              </div>
              <div className="absolute left-0 top-0 h-full w-full">
                <SimpleScatterPlot
                  id={id}
                  datasetName={datasetName}
                  variableX={xVariableName}
                  xData={xData}
                  variableY={yVariableName}
                  yData={yData}
                  theme={theme}
                  onSelected={onSelected}
                  setFilteredIndexes={setFilteredIndexes}
                />
              </div>
            </div>
            <div className="footer text-xs">
              {!isExpanded && (
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
              )}
              {showMore && regression && (
                <div className="w-full text-tiny">
                  <div className="mb-2">
                    <small className="text-tiny text-default-500">
                      R² (All) = {regression.regression.rSquared.toFixed(4)}
                      {regressionResults?.regressionSelected &&
                        ` | R² (Selected) = ${regressionResults.regressionSelected.rSquared.toFixed(4)}`}
                      {regressionResults?.regressionUnselected &&
                        ` | R² (Unselected) = ${regressionResults.regressionUnselected.rSquared.toFixed(4)}`}
                    </small>
                  </div>
                  <Table
                    aria-label="Regression Results"
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
                      <TableColumn>Parameter</TableColumn>
                      <TableColumn>Estimate</TableColumn>
                      <TableColumn>p-Value</TableColumn>
                      <TableColumn>Std. Error</TableColumn>
                      <TableColumn>t-Statistic</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {[
                        // All Data Results
                        ...generateRegressionRows('All', regression.regression),
                        // Selected Data Results
                        ...generateRegressionRows(
                          'Selected',
                          regressionResults?.regressionSelected
                        ),
                        // Unselected Data Results
                        ...generateRegressionRows(
                          'Unselected',
                          regressionResults?.regressionUnselected
                        ),
                      ]}
                    </TableBody>
                  </Table>

                  <div className="mt-2">
                    <small className="text-tiny text-default-500">
                      Chow test for sel/unsel regression subsets: distrib=F(2,{' '}
                      {yData.length - 4}
                      ), ratio=
                      {regressionResults?.chowResults?.fStat.toFixed(4) ||
                        'N/A'}
                      , p-val=
                      {regressionResults?.chowResults?.pValue.toFixed(4) ||
                        'N/A'}
                    </small>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AutoSizer>
  );
}
