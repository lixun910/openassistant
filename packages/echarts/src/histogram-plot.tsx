import { useMemo, useRef, useState } from 'react';
import { CustomFunctionCall } from '@openassistant/core';
import { EChartsOption } from 'echarts';
import ReactEChartsCore from 'echarts-for-react';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
  use as echartsUse,
  registerTheme as echartsRegisterTheme,
} from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  BrushComponent,
  ToolboxComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { TopLevelFormatterParams } from 'echarts/types/dist/shared';
import { ECHARTS_DARK_THEME } from './echarts-theme';
import { HistogramOuputData } from './histogram';
import './index.css';
import { ResizablePlotContainer } from './common/resizable-container';
import { numericFormatter } from './common/utils';

echartsUse([
  BarChart,
  GridComponent,
  TooltipComponent,
  BrushComponent,
  ToolboxComponent,
  CanvasRenderer,
]);

echartsRegisterTheme('dark', ECHARTS_DARK_THEME);

export function histogramCallbackMessage(
  props: CustomFunctionCall
): JSX.Element | null {
  return (
    <ResizablePlotContainer>
      <HistogramComponent {...props} />
    </ResizablePlotContainer>
  );
}

export function HistogramComponent({
  output,
}: CustomFunctionCall): JSX.Element | null {
  const data = output.data as HistogramOuputData | undefined;

  // get chart option by calling getChartOption only once
  const option = useMemo(() => {
    try {
      return data
        ? getHistogramChartOption(null, data.histogramData, data.barDataIndexes)
        : {};
    } catch {
      return {};
    }
  }, [data]);

  const eChartsRef = useRef<ReactEChartsCore>(null);
  // track if the chart has been rendered, so we can update the chart later
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rendered, setRendered] = useState(false);

  // bind events for brush selection in eCharts Histogram
  const bindEvents = useMemo(() => {
    return {
      brushSelected: function (params: {
        batch: Array<{
          selected: Array<{
            dataIndex: number[];
          }>;
        }>;
      }) {
        const brushed: number[] = [];
        const brushComponent = params.batch[0];

        for (let sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
          const rawIndices = brushComponent.selected[sIdx]
            .dataIndex as number[];
          brushed.push(...rawIndices);
        }

        // get selected ids from brushed bars
        const filteredIndex =
          data && brushed.length > 0
            ? brushed.map((idx: number) => data.barDataIndexes[idx]).flat()
            : [];

        // check if this plot is in state.plots
        if (brushed.length === 0) {
          // reset options
          const chart = eChartsRef.current;
          if (chart) {
            const chartInstance = chart.getEchartsInstance();
            const updatedOption = getHistogramChartOption(
              null,
              data?.histogramData ?? [],
              data?.barDataIndexes ?? []
            );
            chartInstance.setOption(updatedOption);
          }
        }
        // Dispatch action to highlight selected in other components
        data?.onSelected?.(data?.datasetName ?? '', filteredIndex);
      },
    };
  }, [data]);

  if (!data?.variableName || !data?.histogramData || !data?.barDataIndexes) {
    return null;
  }

  return (
    <AutoSizer>
      {({ height, width }) => (
        <div style={{ height, width }}>
          <div
            style={{ height: '100%' }}
            className="h-full w-full flex flex-col rounded-lg bg-default-100 p-6 text-gray-900 shadow-secondary-1 dark:bg-gray-950 dark:text-gray-100"
          >
            <div className="flex-col items-start p-2">
              <p className="text-tiny font-bold uppercase">
                {data?.variableName}
              </p>
              <small className="truncate text-default-500">
                {data?.variableName}
              </small>
            </div>
            <div style={{ height: '100%' }} className="py-2 flex-grow">
              <ReactEChartsCore
                option={option}
                notMerge={true}
                lazyUpdate={true}
                style={{ height: '100%', width: '100%' }}
                ref={eChartsRef}
                theme={data?.theme || 'dark'}
                onEvents={bindEvents}
                onChartReady={() => {
                  setRendered(true);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </AutoSizer>
  );
}

export type HistogramDataProps = {
  bin: number;
  binStart: number;
  binEnd: number;
};

const defaultBarColors = [
  '#FF6B6B',
  '#48BB78',
  '#4299E1',
  '#ED64A6',
  '#F6E05E',
];

function getHistogramChartOption(
  filteredIndex: number[] | null,
  histogramData: HistogramDataProps[],
  barDataIndexes: number[][]
): EChartsOption {
  const hasHighlighted = filteredIndex && filteredIndex.length > 0;

  // create a dictionary to store the indexes of data items that have been filtered
  const filteredIndexDict: { [key: number]: boolean } = {};
  if (hasHighlighted) {
    filteredIndex.forEach((d: number) => {
      filteredIndexDict[d] = true;
    });
  }

  // build highlighted bars from filteredIndex and filteredIndexDict
  const highlightedBars = histogramData.map(
    (d: HistogramDataProps, i: number) => {
      // get highlighted ids for each bar
      const highlightedIds = barDataIndexes[i].filter(
        (d: number) => filteredIndexDict[d] === true
      );

      return {
        value: hasHighlighted ? highlightedIds?.length : 0,
        itemStyle: {
          color: defaultBarColors[i % defaultBarColors.length],
          opacity: 1,
        },
        name: `[${numericFormatter(d.binStart)} - ${numericFormatter(
          d.binEnd
        )}]`,
        // ids that associated with the bar and been filtered
        ids: hasHighlighted ? highlightedIds : [],
      };
    }
  );

  // use binStart values as the x axis tick values
  // const xTickValues = plotData.map((d: HistogramDataProps) => d.binStart.toFixed(1));

  // get min value from plotData
  const minValue = histogramData[0].binStart;
  const maxValue = histogramData[histogramData.length - 1].binEnd;
  const numBins = histogramData.length;
  const interval = (maxValue - minValue) / numBins;

  // get bar data from plotData
  const barData = histogramData.map((d: HistogramDataProps, i: number) => {
    return {
      value: hasHighlighted
        ? barDataIndexes[i].length - highlightedBars[i].value
        : barDataIndexes[i].length,
      itemStyle: {
        color: defaultBarColors[i % defaultBarColors.length],
        opacity: hasHighlighted ? 0.5 : 1,
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.3)',
      },
      name: `[${numericFormatter(d.binStart)} - ${numericFormatter(d.binEnd)}]`,
      // ids that associated with the bar and been filtered
      ids: barDataIndexes[i],
    };
  });

  const series = [
    {
      data: highlightedBars,
      type: 'bar' as const,
      barWidth: '90%',
      stack: 'total',
      xAxisIndex: 0,
    },
    {
      data: barData,
      type: 'bar' as const,
      barWidth: '90%',
      stack: 'total',
      xAxisIndex: 0,
      label: {
        show: false,
        position: [0, -15],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: function (params: any): string {
          return params.value.toString();
        },
      },
    },
  ];

  // build option for echarts
  const option: EChartsOption = {
    xAxis: [
      {
        type: 'category',
        // data: xTickValues,
        // axisLabel: {
        //   interval: 0,
        //   hideOverlap: true
        // },
        // axisTick: {
        //   alignWithLabel: false,
        //   interval: 0
        // },
        axisTick: { show: false },
        axisLabel: { show: false },
        axisLine: { show: false },
        position: 'bottom',
        splitLine: {
          show: true,
        },
      },
      {
        scale: true,
        type: 'value',
        min: minValue,
        max: maxValue,
        interval: interval,
        axisLabel: {
          hideOverlap: true,
          rotate: 35,
          overflow: 'truncate',
          formatter: numericFormatter,
        },
        splitLine: {
          show: false,
        },
        position: 'bottom',
      },
    ],
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: numericFormatter,
      },
      splitLine: {
        show: false,
      },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    series,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: function (
        params: TopLevelFormatterParams | TopLevelFormatterParams[]
      ) {
        const paramsArray = Array.isArray(params) ? params : [params];
        // ids that associated with the bar
        const range = (paramsArray[1] as { data: { name: string } }).data.name;
        const count = (paramsArray[1] as { value: number }).value;
        return `Range: ${range}<br/> # Items: ${count}`;
      },
    },
    brush: {
      toolbox: ['rect', 'keep', 'clear'],
      xAxisIndex: 0,
    },
    grid: [
      {
        left: '3%',
        right: '5%',
        top: '20%',
        bottom: '0%',
        containLabel: true,
        height: 'auto',
      },
    ],
  };

  return option;
}
