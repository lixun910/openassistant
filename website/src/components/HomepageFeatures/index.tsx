import { type ReactNode } from 'react';
import clsx from 'clsx';
// import Heading from '@theme/Heading';
import styles from './styles.module.css';
import { AllFeatures } from './all-features';
import {
  highlightFeatures,
  HighlightFeatureComponent,
} from './highlight-features';
import { AiAssistantConfig } from '@openassistant/ui';
import { QuickStart } from './quick-start';

export type HomepageFeaturesProps = {
  aiConfig: AiAssistantConfig;
  onAiConfigChange: (config: AiAssistantConfig) => void;
};

export default function HomepageFeatures({
  aiConfig,
  onAiConfigChange,
}: HomepageFeaturesProps): ReactNode {
  return (
    <section className={clsx(styles.features, 'flex flex-col gap-4 !p-0')}>
      {highlightFeatures.map((feature, index) => (
        <HighlightFeatureComponent
          aiConfig={aiConfig}
          onAiConfigChange={onAiConfigChange}
          key={index}
          {...feature}
        />
      ))}
      <AllFeatures />
      <QuickStart />
    </section>
  );
}
