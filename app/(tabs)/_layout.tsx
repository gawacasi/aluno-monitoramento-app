import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getAuthState } from '../../services/auth';

export default function TabLayout() {
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
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#ddd',
          backgroundColor: '#fff',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      {user?.type === 'professor' && (
        <Tabs.Screen
          name="my-classes"
          options={{
            title: 'Minhas Turmas',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book" size={size} color={color} />
            ),
          }}
        />
      )}
      {user?.type === 'professor' && (
        <Tabs.Screen
          name="create-class"
          options={{
            title: 'Criar Turma',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle" size={size} color={color} />
            ),
          }}
        />
      )}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
