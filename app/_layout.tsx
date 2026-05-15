import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { ApiError } from '../services/api';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status === 401) return false;
        return failureCount < 2;
      },
    },
  },
});

function NavigationGuard() {
  const { token } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (token === undefined) return; // still loading
    SplashScreen.hideAsync();
    const inAuthGroup = segments[0] === '(auth)';
    if (!token && !inAuthGroup) router.replace('/(auth)/login');
    if (token && inAuthGroup) router.replace('/(tabs)');
  }, [token, segments]);

  if (token === undefined) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modal/[ticker]" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationGuard />
      </AuthProvider>
    </QueryClientProvider>
  );
}
