import React from 'react';
import Chat from './Chat';

export default function App() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="w-[500px] h-full">
        <Chat />
      </div>
    </div>
  );
}
