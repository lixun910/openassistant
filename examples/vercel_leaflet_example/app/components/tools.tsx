'use client';

import { LocalQueryTool } from './tool-components/local-query';

import dynamic from 'next/dynamic';

const LeafletTool = dynamic(() => import('./tool-components/leaflet'), {
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center">
      Loading map...
    </div>
  ),
  ssr: false,
});

const HistogramTool = dynamic(() => import('./tool-components/histogram'), {
  ssr: false,
});

const WeightsTool = dynamic(() => import('./tool-components/weights-info'), {
  ssr: false,
});

interface ToolInvocationProps {
  toolCallId: string;
  state: string;
  toolName: string;
  additionalData: unknown;
  getValues: (datasetName: string, variableName: string) => Promise<unknown[]>;
}

export function ToolInvocation({
  toolCallId,
  state,
  toolName,
  additionalData,
  getValues,
}: ToolInvocationProps) {
  if (state === 'result' && additionalData) {
    switch (toolName) {
      case 'localQuery':
        return (
          <LocalQueryTool
            key={toolCallId}
            toolCallId={toolCallId}
            additionalData={additionalData}
            getValues={getValues}
          />
        );
      case 'histogram':
        return (
          <HistogramTool key={toolCallId} additionalData={additionalData} />
        );
      case 'spatialWeights':
        return <WeightsTool key={toolCallId} additionalData={additionalData} />;
      case 'leaflet':
        return <LeafletTool key={toolCallId} additionalData={additionalData} />;
    }
  }
  return null;
}
