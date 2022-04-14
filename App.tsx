import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { useRemoteMediaClient } from 'react-native-google-cast';
import { CastButton } from 'react-native-google-cast';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const client = useRemoteMediaClient();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <React.Fragment>
        <CastButton style={{ tintColor: 'black', width: 44, height: 44 }} />
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          {/* <StatusBar /> */}
        </SafeAreaProvider>
      </React.Fragment>
    );
  }
}
