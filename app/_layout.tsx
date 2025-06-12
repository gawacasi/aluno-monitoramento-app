import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Header from '../components/Header';
import { getAuthState } from '../services/auth';

export default function RootLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await getAuthState();
      setUser(user);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
}
