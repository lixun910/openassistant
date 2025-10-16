---
title: Use OpenAssistant to Build AI Apps for Spatial Data Analysis
date: 2025-01-31
author: LLM 
tags: [spatial-analysis, ai, maps, tutorial, beginners]
---

# Use OpenAssistant to Build AI Apps for Spatial Data Analysis

Author: LLM (Large Language Model) Editor: Xun Li

Date: 2025-10-15

Join us to build AI applications for spatial data analysis using OpenAssistant. 

<img src="/kepler-tool-demo-1.gif" />

## Quick Start

Let me start by showing you the code that made this possible. Don't worry if it looks intimidating at first - I'll explain everything step by step.

```tsx
import { Assistant } from '@openassistant/assistant';
import { keplergl } from '@openassistant/maps';
import { KeplerGlComponent } from '@openassistant/keplergl';

// This is just some sample data about cities
const SAMPLE_DATASETS = {
  cities: [
    { name: 'San Francisco', population: 800000, latitude: 37.774929, longitude: -122.419416 },
    { name: 'New York', population: 8400000, latitude: 40.712776, longitude: -74.005974 },
    { name: 'Los Angeles', population: 3900000, latitude: 34.052235, longitude: -118.243683 },
    { name: 'Chicago', population: 2700000, latitude: 41.878113, longitude: -87.629799 },
    { name: 'Houston', population: 2300000, latitude: 29.760427, longitude: -95.369804 },
  ],
};

// This connects our data to the map tool
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

// This is our main app component
export function App() {
  return (
    <div className="flex h-screen w-screen items-center justify-center p-4">
      <div className="w-full max-w-[900px] h-full">
        <Assistant options={{
          ai: {
            getInstructions: () => `You are a helpful assistant that can answer questions and help with tasks.
Your name is George.
You can use the following datasets to answer the user's question:
- Dataset: cities
 - Fields: name, population, latitude, longitude`,
            tools: {
              keplergl: keplerMapTool,
            },
          },
        }} />
      </div>
    </div>
  );
}
```

## What Just Happened Here?

Okay, let me break this down in plain English. This code does something pretty amazing:

1. **We imported the tools we need**: Think of these like specialized helpers that know how to work with maps and AI
2. **We created some sample data**: Just a simple list of cities with their populations and coordinates
3. **We connected the data to a map tool**: This tells the AI "hey, when someone asks about maps, use this data"
4. **We created a chat interface**: This is where users can talk to the AI


## The Chat Interface That Makes It All Possible

One of the coolest things about OpenAssistant is that it comes with a ready-made chat interface. You don't have to build your own - it's already there, looking professional and working perfectly.

<img src="/sqlrooms_ai_chat.png" alt="OpenAssistant Chat Interface" />

This interface lets users:
- Easy provider and model selection and configuration
- Support provider and model settings management
- Support custom models
- Support model usage tracking

It's like having a professional chat app built right into your application, without having to code it yourself. For more details, please visit Sqlrooms: https://sqlrooms.org.

## All tools that OpenAssistant provides

OpenAssistant provides a comprehensive suite of tools for spatial data analysis and GIS applications. Each tool is designed to be used with AI language models to help users analyze, visualize, and manipulate spatial data.

- @openassistant/duckdb - SQL query execution in the browser
- @openassistant/geoda - Spatial statistics and analysis
- @openassistant/map - Map data manipulation and visualization tools
- @openassistant/osm - OpenStreetMap data access and routing
- @openassistant/places - Location search and geotagging
- @openassistant/plots - Statistical visualizations
- @openassistant/h3 - Hexagonal spatial indexing

See the [API Reference](/guide/) for more details.

Want to add charts to your app? It's just as easy. Here's how I added a histogram tool:

```ts
import { generateText } from 'ai';
import { histogram, HistogramTool } from '@openassistant/plots';
import { convertToVercelAiTool } from '@openassistant/utils';

const histogramTool: HistogramTool = {
  ...histogram,
  context: {
    getValues: async (datasetName, variableName) => {
      // This is where you'd get real data from your database
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    },
  },
  onToolCompleted: (toolCallId, additionalData) => {
    // This runs when the chart is created - you can save it or do something else
    console.log('Chart created!', toolCallId, additionalData);
  },
};

// Now use it with any AI model
const result = await generateText({
  model: openai('gpt-4o', { apiKey: key }),
  system: 'You are a helpful assistant',
  prompt: 'create a histogram of HR60 in dataset Natregimes',
  tools: { histogram: convertToVercelAiTool(histogramTool) },
});
```

<img src="https://openassistant-doc.vercel.app/img/histogram-1-400.png" width="400" alt="Histogram Plugin" />

## Why This Approach Is So Powerful

Here's what makes OpenAssistant special:

**It's built for maps and spatial data**: Unlike generic AI tools, this one actually understands geography. It knows what latitude and longitude mean, it can create heatmaps, and it can analyze spatial relationships.

**It works with any AI model**: Whether you prefer ChatGPT, Claude, or something else, OpenAssistant works with all of them.

**You only install what you need**: Don't need maps? Don't install the map tools. Only want charts? Just install the chart tools. It's like a buffet - take what you want.

**It's production-ready**: This isn't some experimental code. It's been tested and used in real applications.

## Spatial Data Analysis with AI

One of the most exciting applications of OpenAssistant is the **Kepler.GL AI Assistant**, which transforms the popular Kepler.gl mapping platform into a powerful spatial data analysis tool powered by Generative AI. Built on top of OpenAssistant, this integration demonstrates how AI can revolutionize spatial data exploration and analysis.

![Kepler.GL AI Assistant Demo](https://github.com/user-attachments/assets/406afbfe-4671-42a6-8f38-90cdf171c363)

The Kepler.GL AI Assistant provides a comprehensive suite of spatial analysis tools that work seamlessly with large language models. Users can perform complex spatial operations through simple natural language commands, making advanced GIS analysis accessible to everyone.

Try it out yourself by visiting the [https://kepler.gl/](https://kepler.gl/).

For detailed documentation and examples, visit the [Kepler.GL AI Assistant Guide](https://geodaai.github.io/docs-kepler-ai/guide.html).

### Why This Matters

Traditional GIS software requires extensive training and technical expertise. The Kepler.GL AI Assistant democratizes spatial analysis by allowing users to:
- Ask questions in plain English
- Get immediate visual feedback
- Perform complex analyses without writing code
- Focus on insights rather than technical implementation

This integration showcases the true potential of combining OpenAssistant's flexible tool architecture with domain-specific spatial analysis capabilities, creating an AI-powered platform that makes advanced spatial data science accessible to everyone.

## Getting Started Is Easier Than You Think

Ready to try this yourself? Here's how to get started:

1. **Install the tools you need**:
   ```bash
   npm install @openassistant/duckdb @openassistant/geoda @openassistant/map
   ```

2. **Check out the examples**:
   - [Map Example](https://github.com/geodaopenjs/openassistant/tree/main/examples/map_example) - See how to build map-based apps
   - [Chat Example](https://github.com/geodaopenjs/openassistant/tree/main/examples/chat_example) - Learn the basics of the chat interface

3. **Read the docs**: The [Getting Started Guide](/guide/getting-started) walks you through everything step by step

4. **Join the community**: Got questions? The [GitHub discussions](https://github.com/geodaopenjs/openassistant/discussions) are super helpful

5. **Building Your Own Custom Tools**

Here's where things get really interesting. You can create your own tools that do exactly what you need. Let me show you how I built a simple weather tool:

```ts
import { OpenAssistantTool, convertToVercelAiTool } from '@openassistant/utils';
import { generateText } from 'ai';
import { z } from 'zod';

// First, I define what my tool needs
type WeatherToolArgs = { cityName: string };
type WeatherToolResult = { weather: string };
type WeatherToolAdditionalData = { station: string };
type WeatherToolContext = {
  getStation: (cityName: string) => Promise<{ stationId: string; weather: string; timestamp: string }>;
};

// Then I create the actual tool
const weatherTool: OpenAssistantTool<WeatherToolArgs, WeatherToolResult, WeatherToolAdditionalData, WeatherToolContext> = {
  name: 'getWeather',
  description: 'Get the weather in a city from a weather station',
  parameters: z.object({ cityName: z.string() }),
  context: {
    getStation: async (cityName: string) => {
      // This is where I'd normally call a real weather API
      const stations = {
        'New York': {
          stationId: '123',
          weather: 'sunny',
          timestamp: '2025-06-20 10:00:00',
        },
      };
      return stations[cityName];
    },
  },
  execute: async (args, options) => {
    if (!options || !options.context || !options.context['getStation']) {
      throw new Error('Context is required');
    }
    const getStation = options.context['getStation'];
    const station = await getStation(args.cityName as string);
    return {
      llmResult: {
        success: true,
        result: `The weather in ${args.cityName} is ${station.weather} from weather station ${station.station}.`,
      },
      additionalData: {
        station,
      },
    };
  },
});
```

This might look complex, but it's actually pretty straightforward:

1. **It takes a city name as input** (like "New York")
2. **It looks up weather data** (in this example, I'm using fake data, but you could connect to a real weather API)
3. **It returns the weather information** in a format the AI can understand and share with the user

Now users can ask: "What's the weather like in New York?" and the AI will use this tool to get the answer.


## The Bottom Line

Building AI applications that understand maps and spatial data used to be really hard. You'd need to know GIS software, understand coordinate systems, and spend months building visualization tools.

OpenAssistant changes all that. Now you can focus on solving real problems instead of building infrastructure. Whether you're analyzing city data, tracking environmental changes, or helping people find the best coffee shops, OpenAssistant gives you the tools to make it happen.

The best part? It's open source, well-documented, and has a community of developers who are happy to help.

**Ready to build something amazing?** Check out the [GitHub repository](https://github.com/geodaopenjs/openassistant) and start creating your own AI-powered spatial applications today!

---

*Questions? Comments? Want to share what you've built? Drop by our [community discussions](https://github.com/geodaopenjs/openassistant/discussions) - we'd love to hear from you!*
