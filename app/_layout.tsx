import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import {
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import {
  AppPreferencesProvider,
  useAppPreferences,
} from '../src/context/AppPreferencesContext';
import { lightColors } from '../src/theme/palettes';

SplashScreen.preventAutoHideAsync();

const FONT_LOAD_TIMEOUT_MS = 4000;

function RootNavigator() {
  const { statusBarStyle, ready: prefsReady } = useAppPreferences();
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      setReady(true);
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setReady(true);
      void SplashScreen.hideAsync();
    }, FONT_LOAD_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, []);

  if (!ready || !prefsReady) {
    return <View style={{ flex: 1, backgroundColor: lightColors.background }} />;
  }

  return (
    <>
      <StatusBar style={statusBarStyle} />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AppPreferencesProvider>
      <RootNavigator />
    </AppPreferencesProvider>
  );
}
