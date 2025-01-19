import { useState, type ReactNode } from 'react';
import clsx from 'clsx';
// import Link from '@docusaurus/Link';
// import Heading from '@theme/Heading';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import { useColorMode } from '@docusaurus/theme-common';

import styles from './index.module.css';
import {
  AiAssistant,
  AiAssistantConfig,
  ConfigPanel,
  ScreenshotWrapper,
} from '@openassistant/ui';
import {
  createMapFunctionDefinition,
  GetDatasetForCreateMapFunctionArgs,
} from '@openassistant/keplergl';
import { MessageModel } from '@openassistant/core';
import { Link, Tab, Tabs } from '@nextui-org/react';
import { CodeBlock } from '../components/HomepageFeatures/code-block';
import {
  codeScreenCapture,
  testData,
} from '../components/HomepageFeatures/code-content';

function HomepageHeader() {
  // const { siteConfig } = useDocusaurusContext();
  return (
    <header
      className={clsx(
        'hero hero--primary bg-white dark:bg-black mb-0 p-0',
        styles.heroBanner
      )}
    >
      <div className="container text-left m-0">
        {/*<Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
         <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Docusaurus Tutorial - 5min ⏱️
          </Link>
        </div> */}
        <div className="flex flex-col gap-2">
          <div className="text-gray-600 dark:text-gray-100 font-bold text-[46px]">
            Build AI-Powered Applications
          </div>
          <div className="text-gray-400 text-[32px]">
            with built-in{' '}
            <span className="text-purple-400 font-bold">interactive</span>{' '}
            features and powerful{' '}
            <span className="text-warning font-bold">plugins</span>
            <br />
            while keeping your data{' '}
            <span className="text-gray-400 font-bold">secure</span>
          </div>
          <div className="mt-8 rounded-lg  w-fit bg-gray-200 dark:bg-gray-800 p-4">
            <Link size="lg" href="/docs/intro" showAnchorIcon>
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function HomeContent() {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === 'dark' ? 'bg-gray-700' : 'bg-white';

  const [startScreenCapture, setStartScreenCapture] = useState(false);
  const [screenCaptured, setScreenCaptured] = useState('');

  const [aiConfig, setAiConfig] = useState<AiAssistantConfig>({
    isReady: false,
    provider: 'openai',
    model: 'gpt-4o',
    apiKey: '',
    baseUrl: 'http://127.0.0.1:11434',
    temperature: 0.8,
    topP: 1.0,
  });

  const onAiConfigChange = (config: AiAssistantConfig) => {
    setAiConfig(config);
  };

  const historyMessages: MessageModel[] = [
    {
      message: 'Hello, how can I help you today?',
      direction: 'incoming',
      position: 'single',
    },
    {
      message: 'Can you show me what data I can use in the chat?',
      direction: 'outgoing',
      position: 'single',
    },
    {
      message: `Here is the data you can use in the chat:

dataset: samples
column names:
- latitude (float)
- longtitude (float)
- price (float)
- population (int)

Please select your prefered LLM model and use your API key to start the chat.
      `,
      direction: 'incoming',
      position: 'single',
      payload: (
        <div className="mt-4">
          <ConfigPanel
            initialConfig={aiConfig}
            onConfigChange={onAiConfigChange}
          />
        </div>
      ),
    },
  ];

  const instructions = `You are a data and map analyst. You can help users to create a map from a dataset. If a function calling can be used to answer the user's question, please always confirm the function calling and its arguments with the user. Please use the following meta data for function callings: 
dataset: samples
rows: 10 rows
column names:
- latitude (float)
- longtitude (float)
- price (float)
- population (int)`;

  const myDatasets = {
    samples: JSON.parse(testData),
  };

  const functions = [
    createMapFunctionDefinition({
      getDataset: ({ datasetName }: GetDatasetForCreateMapFunctionArgs) => {
        // check if the dataset exists
        if (!myDatasets[datasetName]) {
          throw new Error('The dataset does not exist.');
        }
        return myDatasets[datasetName];
      },
    }),
  ];

  return (
    <div>
      <ScreenshotWrapper
        setScreenCaptured={setScreenCaptured}
        startScreenCapture={startScreenCapture}
        setStartScreenCapture={setStartScreenCapture}
      >
        <div className="relative">
          <HomepageHeader />
          <main className="items-center flex justify-center">
            <HomepageFeatures
              aiConfig={aiConfig}
              onAiConfigChange={onAiConfigChange}
            />
          </main>
          <div
            className={`md:fixed md:right-0 md:top-20 w-[380px] sm:w-[460px] sm:p-5 h-[90vh] z-[1000]`}
          >
            <Tabs aria-label="Options" variant="underlined">
              <Tab key="assistant" title="Assistant" className="h-full">
                <div
                  className={`h-full w-full pt-2 pb-4 ${bgColor} rounded-lg drop-shadow-2xl`}
                >
                  <AiAssistant
                    name="My Assistant"
                    apiKey={aiConfig.apiKey}
                    version="v1"
                    modelProvider={aiConfig.provider}
                    model={aiConfig.model}
                    baseUrl={aiConfig.baseUrl}
                    welcomeMessage="Hello, how can I help you today?"
                    instructions={instructions}
                    enableVoice={true}
                    enableScreenCapture={true}
                    screenCapturedBase64={screenCaptured}
                    onScreenshotClick={() => setStartScreenCapture(true)}
                    onRemoveScreenshot={() => setScreenCaptured('')}
                    functions={functions}
                    theme={colorMode}
                    historyMessages={historyMessages}
                    githubIssueLink="https://github.com/geodacenter/openassistant/issues"
                  />
                </div>
              </Tab>
              <Tab key="code" title="</>" className="h-full">
                <div
                  className={`h-full w-full pt-2 pb-4 ${bgColor} rounded-lg drop-shadow-2xl`}
                >
                  <CodeBlock
                    code={[
                      {
                        title: 'App.tsx',
                        content: codeScreenCapture,
                      },
                    ]}
                  />
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </ScreenshotWrapper>
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
