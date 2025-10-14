import React from 'react';
import {ThemeProvider} from '@sqlrooms/ui';
import {RoomStateProvider, type RoomStateProviderProps, type BaseRoomConfig} from '@sqlrooms/room-store';
import {MainView} from './components/MainView';
import {roomStore as defaultRoomStore} from './store';
import {createAssistantStore, AssistantOptions} from './createAssistantStore';

type AssistantProps = {
  options?: AssistantOptions;
  children?: React.ReactNode;
};

export const Assistant: React.FC<AssistantProps> = ({options, children}) => {
  const storeRef = React.useRef<ReturnType<typeof createAssistantStore>>();
  if (!storeRef.current && options) {
    storeRef.current = createAssistantStore(options);
  }
  const effectiveStore = storeRef.current?.roomStore ?? defaultRoomStore;

  // Cast provider to a valid JSX component type (library types return ReactNode)
  const RoomProvider = RoomStateProvider as unknown as React.ComponentType<
    RoomStateProviderProps<BaseRoomConfig>
  >;

  return (
    <ThemeProvider defaultTheme="dark" storageKey="sqlrooms-ui-theme">
      <RoomProvider roomStore={effectiveStore}>
        {children ?? <MainView />}
      </RoomProvider>
    </ThemeProvider>
  );
};

