'use client';

import { useState } from 'react';
import Header from '../components/homepage/header';
import Main from '../components/homepage/main';
import { ScreenshotWrapper } from '@openassistant/ui';

export default function Home() {
  const [startScreenCapture, setStartScreenCapture] = useState(false);
  const [screenCaptured, setScreenCaptured] = useState('');

  return (
    <ScreenshotWrapper
      setScreenCaptured={setScreenCaptured}
      startScreenCapture={startScreenCapture}
      setStartScreenCapture={setStartScreenCapture}
    >
      <div className="flex h-screen w-screen flex-col">
        <Header className="flex-grow-0 border-b border-gray-200" />
        <Main
          className="flex-grow flex-1"
          screenCaptured={screenCaptured}
          setStartScreenCapture={setStartScreenCapture}
          setScreenCaptured={setScreenCaptured}
        />
      </div>
    </ScreenshotWrapper>
  );
}
