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
      "name": "venue 1",
      "longitude": -73.99389648,
      "latitude": 40.75011063,
      "revenue": 1000000,
      "population": 1000000
    },
    {
      "name": "venue 2",
      "longitude": -73.97642517,
      "latitude": 40.73981094,
      "revenue": 2000000,
      "population": 2000000
    },
    {
      "name": "venue 3",
      "longitude": -73.96870422,
      "latitude": 40.75424576,
      "revenue": 3000000,
      "population": 3000000
    },
    {
      "name": "venue 4",
      "longitude": -73.95987634,
      "latitude": 40.76012845,
      "revenue": 4000000,
      "population": 4000000
    },
    {
      "name": "venue 5",
      "longitude": -73.96543210,
      "latitude": 40.75789321,
      "revenue": 5000000,
      "population": 5000000
    }
  ]`;
