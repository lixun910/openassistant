// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { OnToolCompleted } from '@openassistant/utils';
import { createToolRegistry } from '@openassistant/tools-shared';

import { boxplot, BoxplotTool } from './echarts/boxplot/tool';
import { bubbleChart, BubbleChartTool } from './echarts/bubble-chart/tool';
import { histogram, HistogramTool } from './echarts/histogram/tool';
import { pcp, PCPTool } from './echarts/pcp/tool';
import { scatterplot, ScatterplotTool } from './echarts/scatterplot/tool';
import { vegaLitePlot, VegaLitePlotTool } from './vegalite/tool';
import { GetValues, OnSelected } from './types';

// export the enum of tool names, so users can use it to check if a tool is available
export enum PlotsToolNames {
  boxplot = 'boxplot',
  bubbleChart = 'bubbleChart',
  histogram = 'histogram',
  pcp = 'pcp',
  scatterplot = 'scatterplot',
  vegaLitePlot = 'vegaLitePlot',
}

export type ToolContext = {
  getValues: GetValues;
  onSelected?: OnSelected;
};

const toolRegistry = createToolRegistry({
  boxplot,
  bubbleChart,
  histogram,
  pcp,
  scatterplot,
  vegaLitePlot,
});

export const tools = toolRegistry.tools;
export const registerTools = toolRegistry.registerTools;

export function getPlotsTool(
  toolName: string,
  options: {
    toolContext?: ToolContext;
    onToolCompleted?: OnToolCompleted;
    isExecutable?: boolean;
  }
) {
  return toolRegistry.createTool(toolName, options);
}

export function getPlotsTools(
  toolContext: ToolContext,
  onToolCompleted: OnToolCompleted,
  isExecutable: boolean = true
) {
  return toolRegistry.createAllTools(toolContext, onToolCompleted, isExecutable);
}

// Export tool classes for direct usage
export { 
  BoxplotTool, 
  BubbleChartTool, 
  HistogramTool, 
  PCPTool, 
  ScatterplotTool, 
  VegaLitePlotTool 
};
