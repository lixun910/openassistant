import { keplergl } from '@openassistant/map';
import { KeplerGlComponent } from '@openassistant/keplergl';
import { Assistant, type AssistantOptions } from '@openassistant/assistant';

// Sample dataset for demonstration
const SAMPLE_DATASETS = {
  venues: [
    { name: 'Golden Gate Park', city: 'San Francisco', rating: 4.5 },
    { name: "Fisherman's Wharf", city: 'San Francisco', rating: 4.2 },
    { name: 'Alcatraz Island', city: 'San Francisco', rating: 4.7 },
  ],
  cities: [
    {
      name: 'San Francisco',
      population: 800000,
      latitude: 37.774929,
      longitude: -122.419416,
    },
    {
      name: 'New York',
      population: 8400000,
      latitude: 40.712776,
      longitude: -74.005974,
    },
    {
      name: 'Los Angeles',
      population: 3900000,
      latitude: 34.052235,
      longitude: -118.243683,
    },
    {
      name: 'Chicago',
      population: 2700000,
      latitude: 41.878114,
      longitude: -87.629798,
    },
    {
      name: 'Houston',
      population: 2300000,
      latitude: 29.760427,
      longitude: -95.369804,
    },
    {
      name: 'Miami',
      population: 600000,
      latitude: 25.76168,
      longitude: -80.19179,
    },
    {
      name: 'Seattle',
      population: 700000,
      latitude: 47.606209,
      longitude: -122.332071,
    },
    {
      name: 'Denver',
      population: 700000,
      latitude: 39.739236,
      longitude: -104.990251,
    },
    {
      name: 'Las Vegas',
      population: 600000,
      latitude: 36.169941,
      longitude: -115.13983,
    },
    {
      name: 'Orlando',
      population: 600000,
      latitude: 28.538335,
      longitude: -81.379236,
    },
    {
      name: 'Philadelphia',
      population: 1500000,
      latitude: 39.952584,
      longitude: -75.165222,
    },
    {
      name: 'Phoenix',
      population: 1600000,
      latitude: 33.448377,
      longitude: -112.074037,
    },
    {
      name: 'San Antonio',
      population: 1500000,
      latitude: 29.424122,
      longitude: -98.493628,
    },
    {
      name: 'San Diego',
      population: 1400000,
      latitude: 32.715738,
      longitude: -117.161084,
    },
    {
      name: 'Dallas',
      population: 1300000,
      latitude: 32.776667,
      longitude: -96.796989,
    },
    {
      name: 'San Jose',
      population: 1000000,
      latitude: 37.338208,
      longitude: -121.886328,
    },
  ],
};

const keplerMapTool = {
  ...keplergl,
  context: {
    getDataset: async (datasetName: string) => {
      if (datasetName in SAMPLE_DATASETS) {
        return SAMPLE_DATASETS[datasetName as keyof typeof SAMPLE_DATASETS];
      }
      throw new Error(`Dataset ${datasetName} not found`);
    },
  },
  component: KeplerGlComponent,
};

const config: AssistantOptions = {
  ai: {
    getInstructions:
      () => `You are a helpful assistant that can answer questions and help with tasks.
Your name is George.
You can use the following datasets to answer the user's question:
- Dataset: venues
 - Fields: name, city, ratin
- Dataset: cities
 - Fields: name, population, latitude, longitude
`,
    tools: {
      keplergl: keplerMapTool,
    },
  },
};

export function App() {
  return (
    <div className="flex h-screen w-screen items-center justify-center p-4">
      <div className="w-full max-w-[900px] h-full">
        <Assistant options={config} />
      </div>
    </div>
  );
}
