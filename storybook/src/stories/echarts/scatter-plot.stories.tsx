import type { Meta, StoryObj } from '@storybook/react';
import {
  ScatterplotComponent,
  ResizablePlotContainer,
} from '@openassistant/echarts';
import { ThemeProvider } from 'next-themes';

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
    (Story, context) => {
      const theme = context.globals.theme || 'light';

      return (
        <ThemeProvider
          attribute="class"
          forcedTheme={theme}
          enableSystem={false}
        >
          <div className="scatter-wrapper w-80 h-80">
            <ResizablePlotContainer>
              <Story />
            </ResizablePlotContainer>
          </div>
        </ThemeProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof ScatterplotComponent>;

const sampleData = {
  type: 'function',
  name: 'scatterplot',
  result: 'success',
  data: {
    xVariableName: 'X Variable',
    yVariableName: 'Y Variable',
    xData: [1, 2, 3, 4, 5],
    yData: [2, 4, 5, 4, 5],
    datasetName: 'sample',
    onSelected: (datasetName: string, indexes: number[]) => {
      console.log('Selected:', datasetName, indexes);
    },
  },
  showLoess: true,
  showRegressionLine: true
};

export const Default: Story = {
  args: {
    output: { ...sampleData, data: { ...sampleData.data, theme: 'light' } },
  },
  parameters: {
    docs: {
      description: {
        story: 'This is a basic example of the scatter plot component with sample data.',
      },
    },
  },
};

export const Dark: Story = {
  args: {
    output: {
      ...sampleData,
      data: { ...sampleData.data, theme: 'dark' },
    },
  },
};
