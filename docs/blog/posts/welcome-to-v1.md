---
title: Welcome to OpenAssistant v1.0.0
date: 2025-01-15
author: OpenAssistant Team
---

# Welcome to OpenAssistant v1.0.0

We're excited to announce the release of OpenAssistant v1.0.0, a major architectural update that makes the toolkit more flexible, modular, and framework-agnostic.

## What's New

### Framework Agnostic

OpenAssistant v1.0.0 is no longer tied to any specific AI framework. You can now use OpenAssistant tools with:

- Vercel AI SDK
- LangChain
- Anthropic SDK
- Google AI SDK
- Any custom framework

### Focused on Tools

We've removed the `@openassistant/core` and `@openassistant/ui` packages to focus entirely on providing the best spatial analysis and GIS tools for AI applications.

### Improved Architecture

All tools now inherit from the `OpenAssistantTool` base class, providing:

- Consistent API across all tools
- Easy framework conversion
- Better type safety
- Enhanced error handling

## Migration from v0.x

If you're using OpenAssistant v0.x, check out our [migration guide](/guide/architecture#migration-from-v0x) to learn how to upgrade to v1.0.0.

## Get Started

```bash
npm install @openassistant/duckdb @openassistant/geoda @openassistant/map
```

Check out the [Getting Started guide](/guide/getting-started) to build your first AI-powered spatial analysis application.

## What's Next

We're working on:

- Python version of OpenAssistant tools
- Additional spatial analysis algorithms
- Raster analysis tools
- Network analysis tools
- More visualization components

Stay tuned for updates!

