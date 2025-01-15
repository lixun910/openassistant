export const codeTailwind = `import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './node_modules/@openassistant/ui/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [nextui()],
}
`;

export const codeGetStarted = `import { AiAssistant } from '@openassistant/ui';

// only for React app without tailwindcss
import '@openassistant/ui/dist/index.css';

function App() {
  return (
    <AiAssistant
      modelProvider="openai"
      model="gpt-4"
      apiKey="your-api-key"
      welcomeMessage="Hello! How can I help you today?"
    />
  );
}`;

export const codeGetStartedDark = `import { AiAssistant } from '@openassistant/ui';
import { ThemeProvider } from 'next-themes';
// only for React app without tailwindcss
import '@openassistant/ui/dist/index.css';

function App() {
  return (
    <ThemeProvider attribute="class" forcedTheme="dark"> 
      <AiAssistant
        modelProvider="openai"
        model="gpt-4"
        apiKey="your-api-key"
        welcomeMessage="Hello! How can I help you today?"
        // enable dark mode for e.g. charts, maps, etc.
        theme="dark"
      />
    </ThemeProvider>
  );
}`;

export const codeConfig = `import { ConfigPanel, AiAssistantConfig } from '@openassistant/ui';

// only for React app without tailwindcss
import '@openassistant/ui/dist/index.css';

function AiConfigPanel() {
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
    // check if the config is ready and start the chat
  };

  return (
    <ConfigPanel
      initialConfig={aiConfig}
      onConfigChange={onAiConfigChange}
    />
  );
}`;

export const codeScreenCapture = `import { AiAssistant, ScreenshotWrapper } from '@openassistant/ui';

// only for React app without tailwindcss
import '@openassistant/ui/dist/index.css';

function App() {
  const [startScreenCapture, setStartScreenCapture] = useState(false);
  const [screenCaptured, setScreenCaptured] = useState('');

  return (
    <ScreenshotWrapper
      setScreenCaptured={setScreenCaptured}
      startScreenCapture={startScreenCapture}
      setStartScreenCapture={setStartScreenCapture}
    >
      <div className="h-[600px] w-[400px] m-4">
        <AiAssistant
          modelProvider="openai"
          model="gpt-4"
          apiKey="your-api-key"
          welcomeMessage="Hello! How can I help you today?"
          // enable screen capture
          enableScreenCapture={true}
          screenCapturedBase64={screenCaptured}
          onScreenshotClick={() => setStartScreenCapture(true)}
          onRemoveScreenshot={() => setScreenCaptured('')}
        />
      </div>
    </ScreenshotWrapper>
  );
}`;

export const codeVoiceToText = `import { AiAssistant, ScreenshotWrapper } from '@openassistant/ui';

// only for React app without tailwindcss
import '@openassistant/ui/dist/index.css';

function App() {
  const [startScreenCapture, setStartScreenCapture] = useState(false);
  const [screenCaptured, setScreenCaptured] = useState('');

  return (
    <ScreenshotWrapper
      setScreenCaptured={setScreenCaptured}
      startScreenCapture={startScreenCapture}
      setStartScreenCapture={setStartScreenCapture}
    >
      <div className="h-[600px] w-[400px] m-4">
        <AiAssistant
          modelProvider="openai"
          model="gpt-4"
          apiKey="your-api-key"
          welcomeMessage="Hello! How can I help you today?"
          // enable voice to text
          enableVoice={true}
          // enable screen capture
          enableScreenCapture={true}
          screenCapturedBase64={screenCaptured}
          onScreenshotClick={() => setStartScreenCapture(true)}
          onRemoveScreenshot={() => setScreenCaptured('')}
        />
      </div>
    </ScreenshotWrapper>
  );
}`;

/**
 * This is a test data for the code block
 * rows: 10 rows
 * column names:
 * - latitude (float)
 * - longtitude (float)
 * - price (float)
 * - population (int)
 */
export const testData = `[
  {
    "latitude": 37.7749,
    "longtitude": -122.4194,
    "price": 1250000.0,
    "population": 873965
  },
  {
    "latitude": 34.0522,
    "longtitude": -118.2437,
    "price": 875000.0,
    "population": 3967000
  },
  {
    "latitude": 40.7128,
    "longtitude": -74.0060,
    "price": 2100000.0,
    "population": 8419000
  },
  {
    "latitude": 51.5074,
    "longtitude": -0.1278,
    "price": 1750000.0,
    "population": 8982000
  },
  {
    "latitude": 35.6762,
    "longtitude": 139.6503,
    "price": 925000.0,
    "population": 9273000
  },
  {
    "latitude": 48.8566,
    "longtitude": 2.3522,
    "price": 1450000.0,
    "population": 2161000
  },
  {
    "latitude": 25.2767,
    "longtitude": 55.2962,
    "price": 1850000.0,
    "population": 3331000
  },
  {
    "latitude": 1.3521,
    "longtitude": 103.8198,
    "price": 1650000.0,
    "population": 5686000
  },
  {
    "latitude": -33.8688,
    "longtitude": 151.2093,
    "price": 1150000.0,
    "population": 5312000
  },
  {
    "latitude": 22.3193,
    "longtitude": 114.1694,
    "price": 1950000.0,
    "population": 7482000
  }
]`;
