# Visualization Components

OpenAssistant provides several React component packages for data visualization.

## ECharts Components

```tsx
import { 
  HistogramChart, 
  ScatterPlot, 
  BoxPlot 
} from '@openassistant/echarts';

// Histogram
<HistogramChart
  data={values}
  bins={20}
  title="Population Distribution"
/>

// Scatter plot
<ScatterPlot
  data={data}
  xField="x"
  yField="y"
  colorField="category"
/>

// Box plot
<BoxPlot
  data={data}
  categories={['A', 'B', 'C']}
  valueField="value"
/>
```

## Map Components

### Kepler.gl

```tsx
import { KeplerGLMap } from '@openassistant/keplergl';

<KeplerGLMap
  data={geojsonData}
  config={keplerConfig}
  height={600}
/>
```

### Leaflet

```tsx
import { LeafletMap } from '@openassistant/leaflet';

<LeafletMap
  data={geojsonData}
  center={[37.7749, -122.4194]}
  zoom={12}
/>
```

## Vega-Lite

```tsx
import { VegaLiteChart } from '@openassistant/vegalite';

<VegaLiteChart
  spec={vegaLiteSpec}
  data={data}
/>
```

## Tables

```tsx
import { DataTable } from '@openassistant/tables';

<DataTable
  data={data}
  columns={columns}
  sortable
  filterable
/>
```

## API References

- [ECharts API](/api/@openassistant/echarts/README)
- [Kepler.gl API](/api/@openassistant/keplergl/README)
- [Leaflet API](/api/@openassistant/leaflet/README)
- [Vega-Lite API](/api/@openassistant/vegalite/README)
- [Tables API](/api/@openassistant/tables/README)

