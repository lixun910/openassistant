import { FeatureCollection } from 'geojson';

export type D3MapOutputData = {
  geoJsonData: FeatureCollection;
  mapBounds: [[number, number], [number, number]];
  zoom: number;
  colorBy?: string;
  colorType?: 'breaks' | 'unique';
  breaks?: number[];
  colors?: string[];
  uniqueValues?: (string | number)[];
  id?: string;
  theme?: string;
  showMore?: boolean;
  isExpanded?: boolean;
  isDraggable?: boolean;
};