import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  GridComponent,
  BrushComponent,
  ToolboxComponent,
} from 'echarts/components';
import { LineChart, ScatterChart } from 'echarts/charts';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScatterplotOutputData } from '../callback-function';
import { calculateLoessRegression } from '../../math/linear-regression';
import { getScatterplotChartOption } from './scatter-option';
import { computeRegression } from './scatter-regression';

// Register the required ECharts components
echarts.use([
  TooltipComponent,
  GridComponent,
  ScatterChart,
  CanvasRenderer,
  BrushComponent,
  ToolboxComponent,
  LineChart,
]);

type ScatterRegressionPlotProps = {
  data: ScatterplotOutputData;
  filteredIndexes: number[];
};

export function ScatterRegressionPlot({
  data,
  filteredIndexes,
}: ScatterRegressionPlotProps) {
  // ref for the echarts instance
  const eChartsRef = useRef<ReactEChartsCore>(null);

  // track if the chart has been rendered, so we can update the chart later
  const [rendered, setRendered] = useState(false);

  const loessResult = useMemo(() => {
    if (!data) return null;
    if (!data.showLoess) return null;
    return calculateLoessRegression(data.xData, data.yData);
  }, [data]);

  // get chart option by calling getChartOption only once
  const option = useMemo(() => {
    if (!data) return {};
    try {
      const { xData, yData, showRegressionLine, showLoess, filteredIndex } =
        data;
      // if regressionResults is not provided, compute it
      const regressionResults =
        data.regressionResults ??
        computeRegression({ xData, yData, filteredIndex });
      return getScatterplotChartOption({
        xData,
        yData,
        showRegressionLine: showRegressionLine ?? false,
        showLoess: showLoess ?? false,
        allRegressionResults: regressionResults.regression,
        selectedRegressionResults: regressionResults.regressionSelected,
        unselectedRegressionResults: regressionResults.regressionUnselected,
        ...(loessResult ? { loessResult } : {}),
      });
    } catch {
      return {};
    }
  }, [data, loessResult]);

  // when filteredIndexTrigger changes, update the chart option using setOption
  useEffect(() => {
    const chart = eChartsRef.current;
    if (rendered && filteredIndexes && chart) {
      const { xData, yData, showRegressionLine, showLoess } = data;
      const regressionResults = computeRegression({
        xData,
        yData,
        filteredIndex: filteredIndexes,
      });
      const updatedOption = getScatterplotChartOption({
        xData,
        yData,
        showRegressionLine: showRegressionLine ?? false,
        showLoess: showLoess ?? false,
        allRegressionResults: regressionResults.regression,
        selectedRegressionResults: regressionResults.regressionSelected,
        unselectedRegressionResults: regressionResults.regressionUnselected,
      });
      if (chart && updatedOption) {
        const chartInstance = chart.getEchartsInstance();
        chartInstance.setOption(updatedOption, true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredIndexes, rendered]);

  return (
    <div className="h-full w-full">
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        notMerge={true}
        lazyUpdate={false}
        theme={data?.theme || 'dark'}
        style={{ height: '100%', width: '100%', opacity: '0.5' }}
        ref={eChartsRef}
        onChartReady={() => {
          setRendered(true);
        }}
      />
    </div>
  );
}
