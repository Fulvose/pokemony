import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  let [fontsLoaded] = useFonts({
    'PixelFont': PressStart2P_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}