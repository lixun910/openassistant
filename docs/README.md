# OpenAssistant Documentation (VitePress)

This directory contains the VitePress documentation for OpenAssistant v1.0.0.

## Getting Started

### Install Dependencies

```bash
cd docs
yarn install
```

### Development

Start the development server:

```bash
yarn dev
```

The documentation will be available at `http://localhost:5173`.

### Build

Build the static documentation site:

```bash
yarn build
```

### Preview

Preview the built site:

```bash
yarn preview
```

## Project Structure

```
docs/
├── .vitepress/
│   └── config.mts           # VitePress configuration
├── guide/                   # User guides
│   ├── index.md            # What is OpenAssistant
│   ├── getting-started.md  # Getting started guide
│   ├── architecture.md     # Architecture overview
│   ├── tools/              # Tool guides
│   ├── components/         # Component guides
│   └── advanced/           # Advanced topics
├── api/                    # Auto-generated API docs (TypeDoc)
├── blog/                   # Blog posts
└── index.md                # Home page
```

## TypeDoc API Documentation

API documentation is automatically generated from TypeScript source code using TypeDoc. The configuration in `typedoc.json` generates markdown documentation for all 17 packages:

**Tools (7 packages):**
- @openassistant/duckdb
- @openassistant/geoda
- @openassistant/h3
- @openassistant/map
- @openassistant/osm
- @openassistant/places
- @openassistant/plots

**Components (9 packages):**
- @openassistant/chat
- @openassistant/common
- @openassistant/d3map
- @openassistant/echarts
- @openassistant/hooks
- @openassistant/keplergl
- @openassistant/leaflet
- @openassistant/tables
- @openassistant/vegalite

**Utils (1 package):**
- @openassistant/utils

### How It Works

1. TypeDoc reads all package source code and generates markdown files in the `/api` directory
2. VitePress picks up these markdown files and renders them as documentation pages
3. The `dev` and `build` scripts automatically run TypeDoc before starting VitePress

You can also manually generate API docs:

```bash
yarn typedoc
```

## Running from Root

You can also run documentation commands from the project root:

```bash
# From project root
yarn docs:dev
yarn docs:build
yarn docs:preview
```

## Deployment

The documentation can be deployed to any static hosting service:

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

The built files will be in `.vitepress/dist/`.

## Contributing

When adding new documentation:

1. Place guides in the appropriate `guide/` subdirectory
2. Update navigation in `.vitepress/config.mts` if needed
3. Follow the existing markdown formatting conventions
4. Test locally before committing

## License

MIT License - see LICENSE file in the project root.

