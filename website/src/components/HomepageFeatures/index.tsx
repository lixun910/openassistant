import {type ReactNode } from 'react';
import clsx from 'clsx';
// import Heading from '@theme/Heading';
import styles from './styles.module.css';
import { AllFeatures } from './all-features';
import {
  highlightFeatures,
  HighlightFeatureComponent,
} from './highlight-features';

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={clsx(styles.features, 'flex flex-col gap-4')}>
      {highlightFeatures.map((feature, index) => (
        <HighlightFeatureComponent key={index} {...feature} />
      ))}
      <AllFeatures />
    </section>
  );
}
