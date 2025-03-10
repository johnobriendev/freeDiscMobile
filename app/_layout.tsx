



import React, { useContext, useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
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

  useEffect(() => {
    // Skip this effect during initial load
    if (isLoading) return;
    
    const inProtectedRoute = protectedRoutes.some(route => 
      segments.join('/').includes(route)
    );

    // If the user is in a protected route and not logged in
    if (inProtectedRoute && !userToken && !isGuest) {
      // Redirect to login with return path
      router.replace({
        pathname: '/login',
        params: { returnTo: segments.join('/') }
      });
    }
  }, [userToken, segments, router, isLoading, isGuest]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return <>{children}</>;
}

// Root layout
export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard>
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
      </AuthGuard>
    </AuthProvider>
  );
}