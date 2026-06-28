import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import '../global.css';

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="camera" options={{ headerShown: false }} />
          <Stack.Screen name="review" options={{ presentation: 'modal' }} />
          <Stack.Screen name="ledger" options={{ presentation: 'card' }} />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
