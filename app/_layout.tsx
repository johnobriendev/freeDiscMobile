//app/_layout.tsx
import React, { useContext, useEffect, useState } from 'react';
import { Stack, Slot, useRouter, useSegments } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Protected routes that require authentication
const protectedRoutes = [
  'rounds/new',
  'rounds/',
  'stats',
  'profile',
  'courses/create'
];

// Auth guard component
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { userToken, isLoading, isGuest } = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Skip route protection during initial load
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }
    
    // Skip this effect during loading
    if (isLoading) return;
    
    const inProtectedRoute = protectedRoutes.some(route => 
      segments.join('/').includes(route)
    );

    // If the user is in a protected route and not logged in or guest
    if (inProtectedRoute && !userToken && !isGuest) {
      // Use a timeout to avoid navigation during render
      setTimeout(() => {
        router.replace({
          pathname: '/login',
          params: { returnTo: segments.join('/') }
        });
      }, 0);
    }
  }, [userToken, segments, router, isLoading, isGuest, initialLoad]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return <>{children}</>;
}

// Root layout with screens
function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="courses/[id]" options={{ title: 'Course Details' }} />
      <Stack.Screen name="courses/create" options={{ title: 'Create Course' }} />
      <Stack.Screen name="rounds/[id]" options={{ title: 'Round Details' }} />
      <Stack.Screen name="rounds/new" options={{ title: 'New Round' }} />
    </Stack>
  );
}

// Root layout
export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard>
        <RootLayoutNav />
      </AuthGuard>
    </AuthProvider>
  );
}
