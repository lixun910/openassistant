import type { Meta, StoryObj } from '@storybook/react';
import {
  ScatterplotComponent,
  computeRegression,
} from '@openassistant/echarts';
import { ThemeWrapper } from './common';

const meta: Meta<typeof ScatterplotComponent> = {
  title: 'Charts/Scatter Plot',
  component: ScatterplotComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A scatter plot component that visualizes the relationship between two variables with optional regression line.
`,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ScatterplotComponent>;

const output = {
  type: 'function',
  name: 'scatterplot',
  result: 'success',
  data: {
    xVariableName: 'X Variable',
    yVariableName: 'Y Variable',
    xData: [
      1, 2.3, 3.1, 4.2, 5.5, 6.1, 7.3, 8.4, 9.2, 10.1, 11.5, 12.2, 13.4, 14.7,
      15.1, 16.3, 17.8, 18.2, 19.5, 20,
    ],
    yData: [
      2.1, 3.8, 4.2, 5.1, 5.8, 6.7, 7.2, 7.8, 8.9, 9.3, 8.7, 10.2, 11.5, 10.8,
      12.3, 13.1, 14.2, 13.8, 15.2, 14.9,
    ],
    datasetName: 'sample',
    onSelected: (datasetName: string, indexes: number[]) => {
      console.log('Selected:', datasetName, indexes);
    },
    filteredIndex: [],
    showLoess: false,
    showRegressionLine: true,
  },
};

const regressionResults = computeRegression({
  xData: output.data.xData,
  yData: output.data.yData,
  filteredIndex: output.data.filteredIndex,
});

export const Default: Story = {
  render: () => (
    <ThemeWrapper forcedTheme="light">
      <ScatterplotComponent
        functionName="scatterplot"
        functionArgs={{}}
        output={{
          ...output,
          data: {
            ...output.data,
            theme: 'light',
            regressionResults
          },
        }}
      />
    </ThemeWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'This is a basic example of the scatter plot component with sample data.',
      },
    },
  },
};

export const Dark: Story = {
  render: () => (
    <ThemeWrapper forcedTheme="dark">
      <ScatterplotComponent
        functionName="scatterplot"
        functionArgs={{}}
        output={{
          ...output,
          data: {
            ...output.data,
            theme: 'dark',
            regressionResults
          },
        }}
      />
    </ThemeWrapper>
  ),
};
