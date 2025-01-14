import type { ReactNode } from 'react';
import clsx from 'clsx';
// import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import { useColorMode } from '@docusaurus/theme-common';

import styles from './index.module.css';
import { AiAssistant } from '@openassistant/ui';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        {/* <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Docusaurus Tutorial - 5min ⏱️
          </Link>
        </div> */}
      </div>
    </header>
  );
}

function HomeContent() {
  const { isDarkTheme } = useColorMode();
  const bgColor = isDarkTheme ? 'bg-gray-700' : 'bg-white';
  
  return (
    <div className="relative">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
      <div className="fixed right-0 top-20 w-[460px] p-5 h-[90vh] z-[1000] opacity-100">
        <div
          className={`h-full w-full pt-2 pb-4 ${bgColor} rounded-lg drop-shadow-2xl`}
        >
          <AiAssistant
            name="My Assistant"
            apiKey=""
            version="v1"
            modelProvider="ollama"
            model="llama3.1"
            baseUrl="http://127.0.0.1:11434"
            welcomeMessage="Hello, how can I help you today?"
            instructions="You are a helpful assistant."
            enableVoice={true}
            enableScreenCapture={true}
            functions={[]}
            theme={isDarkTheme ? 'dark' : 'light'}
          />
        </div>
      </div>
    </div>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="OpenAssistant: A simple, powerful, and extensible chatbot framework for building AI applications."
    >
      <HomeContent />
    </Layout>
  );
}
