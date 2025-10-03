# RFC: OpenAssistant Version 1.0.0 Proposal

## Introduction

This RFC proposes a major version bump for OpenAssistant to 1.0.0.

## Motivation

OpenAssistant 0.x.x is a proof of concept for the OpenAssistant project. There are three major parts in this library:

- `@openassistant/core`: the core package for the OpenAssistant project, which provides a AI assistant hook that can be used to build your own browser-only AI assistant in your own application.
- `@openassistant/ui`: the UI package for the OpenAssistant project. It provides a chat component and a settings panel component.
- tools: different tool packages e.g. `@openassistant/duckdb`, `@openassistant/geoda`, etc.

With recent release of Ai SDK v5, the wide adopted AI SDK now supports both client-side usage and server-side usage. Therefore, the `@openassistant/core` package is no longer needed.

We also put some efforts on `@sqlrooms/ai` package to create a more user-friendly AI assistant UI, which is based on modern frameworks zustand and shadcn/ui. We decided to deprecate the `@openassistant/ui` package and move all the features to `@sqlrooms/ai` package.

By doing this, we can focus on the tools development in OpenAssistant. The target of OpenAssistant 1.0.0 now becomes:

- 1. provide a rich set of AI tools that covers most spatial data analysis tasks and in future all GIS tasks
  - spatial data analysis tools
  - OSM data tools
  - map tools
  - DuckDB tools
  - Places tools
  - plots tools
  - h3 tools
  - web serch tools
  - raster analysis tools
  - network analysis tools
  - geostatistical analysis tools
- 2. support a wide range of AI providers so that the OpenAssistant tools can be used with Ai SDK, LangChain, Anthropic, etc.
- 3. provide a utility package that helps managing data exchange between the OpenAssistant tools (client-side, server-side and client-server) so tools can be easily integrated into your own application.
- 4. provide python version of the OpenAssistant tools so that the OpenAssistant tools can be used in Python applications.

Meanwhile, we will continue to maintain the version 0.x.x for bug fixes to support existing applications.

## Changes

- Deprecate the `@openassistant/core` package.
- Deprecate the `@openassistant/ui` package.

## Tools

### Tool Usage

All OpenAssistant tools now inherit from the `OpenAssistantTool` class, which provides common functions to convert the tool to e.g. AI SDK, LangChain, etc.

```typescript
import { LocalQueryTool } from '@openassistant/duckdb';
import { tool } from 'ai';

const localQueryTool = new LocalQueryTool({
  context: {
    getValues: async (datasetName: string, variableName: string) => {
      return [1, 2, 3];
    },
  },
});

const tool = localQueryTool.toVercelAiTool(tool);
```
