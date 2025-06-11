import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { darkTheme } from '../../config/theme';
import { useAuth } from '../../hooks/useAuth';

export default function TabLayout() {
  const theme = darkTheme;
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          color: theme.text,
        },
        tabBarStyle: {
          backgroundColor: theme.background,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      {user?.type === 'aluno' && (
        <Tabs.Screen
          name="available-classes"
          options={{
            title: 'Aulas Disponíveis',
            tabBarLabel: 'Aulas',
          }}
        />
      )}
      <Tabs.Screen
        name="my-classes"
        options={{
          title: 'Minhas Aulas',
          tabBarLabel: 'Minhas Aulas',
        }}
      />
      <Tabs.Screen
        name="my-reservations"
        options={{
          title: 'Minhas Reservas',
          tabBarLabel: 'Reservas',
        }}
      />
      {user?.type === 'professor' && (
        <Tabs.Screen
          name="create-class"
          options={{
            title: 'Criar Aula',
            tabBarLabel: 'Criar',
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
