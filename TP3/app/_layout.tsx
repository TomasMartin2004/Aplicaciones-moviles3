import { Stack } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { WellnessProvider } from '../src/context/WellnessContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <WellnessProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" /> 
          <Stack.Screen name="login" /> 
          <Stack.Screen name="register" />
        </Stack>
      </WellnessProvider>
    </AuthProvider>
  );
}