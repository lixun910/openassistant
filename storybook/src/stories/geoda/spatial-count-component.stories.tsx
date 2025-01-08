import type { Meta, StoryObj } from '@storybook/react';
import { SpatialCountComponent } from '@openassistant/geoda';
import { SimpleThemeWrapper } from '../echarts/common';

const meta: Meta<typeof SpatialCountComponent> = {
  title: 'Geoda/SpatialCount',
  component: SpatialCountComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A component that displays spatial count data in a paginated table format.
`,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [(Story) => <Story />],
};

export default meta;
type Story = StoryObj<typeof SpatialCountComponent>;

const sampleData = {
  joinResult: Array.from({ length: 25 }, (_, i) => [i]),
  joinValues: {
    Population: Array.from({ length: 25 }, () =>
      Math.floor(Math.random() * 10000)
    ),
    Income: Array.from({ length: 25 }, () =>
      Math.floor(Math.random() * 100000)
    ),
    Age: Array.from({ length: 25 }, () => Math.floor(Math.random() * 50 + 20)),
  },
};

export const Default: Story = {
  render: () => (
    <SimpleThemeWrapper forcedTheme="light">
      <SpatialCountComponent
        joinResult={sampleData.joinResult}
        joinValues={sampleData.joinValues}
      />
    </SimpleThemeWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'This is a basic example of the spatial count component with sample data showing population, income, and age statistics.',
      },
    },
  },
};

export const Dark: Story = {
  render: () => (
    <SimpleThemeWrapper forcedTheme="dark">
      <SpatialCountComponent
        joinResult={sampleData.joinResult}
        joinValues={sampleData.joinValues}
      />
    </SimpleThemeWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'This is a basic example of the spatial count component with sample data showing population, income, and age statistics.',
      },
    },
  },
};

export const ActionButton: Story = {
  render: () => (
    <SimpleThemeWrapper forcedTheme="light">
      <SpatialCountComponent
        joinResult={sampleData.joinResult}
        joinValues={sampleData.joinValues}
        actionButtonLabel="Click me"
        actionButtonOnClick={() => {
          console.log('clicked');
        }}
      />
    </SimpleThemeWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'This is a basic example of the spatial count component with sample data showing population, income, and age statistics.',
      },
    },
  },
};

export const ActionButtonDark: Story = {
  render: () => (
    <SimpleThemeWrapper forcedTheme="dark">
      <SpatialCountComponent
        joinResult={sampleData.joinResult}
        joinValues={sampleData.joinValues}
        actionButtonLabel="Click me"
        actionButtonOnClick={() => {
          console.log('clicked');
        }}
      />
    </SimpleThemeWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'This is a basic example of the spatial count component with sample data showing population, income, and age statistics.',
      },
    },
  },
};

export const EmptyTable: Story = {
  render: () => <SpatialCountComponent joinResult={[]} joinValues={{}} />,
  parameters: {
    docs: {
      description: {
        story: 'Example of the component when no data is provided.',
      },
    },
  },
};

export const SinglePage: Story = {
  render: () => (
    <SpatialCountComponent
      joinResult={Array.from({ length: 5 }, (_, i) => [i])}
      joinValues={{
        Count: Array.from({ length: 5 }, () => Math.floor(Math.random() * 100)),
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Example with fewer rows than the page limit, showing a single page without pagination.',
      },
    },
  },
};
