import React, { useEffect, useContext } from 'react';
import { Stack, router } from 'expo-router';
import { AuthProvider, AuthContext } from './context/AuthContext';

// This layout component will wrap the entire app
function RootLayoutNav() {
  const { userToken, isLoading } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoading) {
      // If no token, redirect to login
      if (!userToken) {
        router.replace('/login');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [userToken, isLoading]);

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Create Account' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

// The root layout must export the AuthProvider to wrap the app
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}



// import React from 'react';
// import { Stack } from 'expo-router';
// import { AuthProvider } from './context/AuthContext';

// export default function RootLayout() {
//   return (
//     <AuthProvider>
//       <Stack>
//         <Stack.Screen name="login" options={{ headerShown: false }} />
//         <Stack.Screen name="register" options={{ title: 'Create Account' }} />
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//       </Stack>
//     </AuthProvider>
//   );
// }



