import { CustomFunctionCall } from "@openassistant/core";
import { ScatterplotOutputData } from "./callback-function";
import { ResizablePlotContainer } from "../common/resizable-container";
import { useState } from "react";
import { ScatterChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {
  TooltipComponent,
  GridComponent,
  BrushComponent,
  ToolboxComponent
} from 'echarts/components';
import AutoSizer from "react-virtualized-auto-sizer";
import { ScatterRegressionPlot } from "./utils/scatter-regression-plot";
import { SimpleScatterPlot } from "./utils/simple-scatter-plots";

// Register the required ECharts components
echarts.use([
  TooltipComponent,
  GridComponent,
  ScatterChart,
  CanvasRenderer,
  BrushComponent,
  ToolboxComponent
]);

export function scatterplotCallbackComponent(props: CustomFunctionCall): JSX.Element | null {
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

  // state for the filtered indexes: simple scatter plot will set this state and the regression plot will rerender based on this state
  const [filteredIndexes, setFilteredIndexes] = useState<number[]>(data?.filteredIndex ?? []);

  if (!data || !data.xData || !data.yData) {
    return null;
  }

  return (
    <AutoSizer>
      {({ height, width }) => (
        <div style={{ height, width }}>
          <div
            className="h-full w-full flex flex-col rounded-lg bg-default-100 p-6 text-gray-900 shadow-secondary-1 dark:bg-gray-950 dark:text-gray-100"
          >
            <div className="flex-col items-start p-2">
              <p className="text-tiny font-bold uppercase">
                Scatterplot
              </p>
              <small className="truncate text-default-500">
                {data?.xVariableName} vs {data?.yVariableName}
              </small>
            </div>
            <div className="relative h-full py-2 flex-grow">
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
          </div>
        </div>
      )}
    </AutoSizer>
  );
}
