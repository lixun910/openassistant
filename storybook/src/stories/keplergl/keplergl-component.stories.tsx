import type { Meta, StoryObj } from '@storybook/react';
import { KeplerGlComponentWithProvider } from '@openassistant/keplergl';
import { SimpleThemeWrapper } from '../echarts/common';

const meta: Meta<typeof KeplerGlComponentWithProvider> = {
  title: 'KeplerGl/mini-map',
  component: KeplerGlComponentWithProvider,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A component that displays a mini map.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [(Story) => <Story />],
};

export default meta;
type Story = StoryObj<typeof KeplerGlComponentWithProvider>;

const datasetName = 'myVenues';
const datasetForKepler = [
  {
    info: {
      label: 'Sample Taxi Trips in New York City',
      id: 'test_trip_data',
      format: 'row',
    },
    data: {
      fields: [
        {
          name: 'tpep_pickup_datetime',
          format: 'YYYY-M-D H:m:s',
          type: 'timestamp',
        },
        { name: 'pickup_longitude', format: '', type: 'real' },
        { name: 'pickup_latitude', format: '', type: 'real' },
      ],
      rows: [
        ['2015-01-15 19:05:39 +00:00', -73.99389648, 40.75011063],
        ['2015-01-15 19:05:39 +00:00', -73.97642517, 40.73981094],
        ['2015-01-15 19:05:40 +00:00', -73.96870422, 40.75424576],
      ],
    },
  },
];

export const Default: Story = {
  render: () => (
    <SimpleThemeWrapper forcedTheme="light">
      <KeplerGlComponentWithProvider
        datasetName={datasetName}
        datasetForKepler={datasetForKepler}
      />
    </SimpleThemeWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story: 'This is a basic example of the mini map component.',
      },
    },
  },
};
