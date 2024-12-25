import React, { useState } from 'react';
import { AiAssistant } from './components/assistant';
import { ScreenshotWrapper } from './components/screenshot-wrapper';
import { ThemeProvider } from 'next-themes';

export function App() {
  const [startScreenCapture, setStartScreenCapture] = useState(false);
  const [screenCaptured, setScreenCaptured] = useState('');

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <div>
        <ScreenshotWrapper
          setScreenCaptured={setScreenCaptured}
          startScreenCapture={startScreenCapture}
          setStartScreenCapture={setStartScreenCapture}
        >
          <div className="h-[600px] w-[400px] pb-4 m-4 bg-slate-700">
            <AiAssistant
              name="my-assistant"
              description="This is my assistant"
              version="0.0.1"
              theme="dark"
              modelProvider="ollama"
              model="llama3.2"
              apiKey=''
              welcomeMessage="Hi, I am your assistant. How can I help you today?"
              instructions=""
              functions={[]}
              enableVoice={true}
              enableScreenCapture={true}
              screenCapturedBase64={screenCaptured}
              onScreenshotClick={() => setStartScreenCapture(true)}
              onRemoveScreenshot={() => setScreenCaptured('')}
            />
          </div>
        </ScreenshotWrapper>
      </div>
    </ThemeProvider>
  );
}
