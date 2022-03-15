/* add in chrome cast */
// to run follow these instructions
//    https://docs.expo.dev/workflow/customizing/
// if yarn fails integrity test https://www.seancdavis.com/posts/fix-yarn-integrity-check-failed/
// don't mix package managers or life sucks
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
      <CastButton style={{ tintColor: 'black', width: 44, height: 44 }} />
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        {/* <StatusBar /> */}
      </SafeAreaProvider>
    );
  }
}
