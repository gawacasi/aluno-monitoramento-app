import { Stack } from 'expo-router';
import { darkTheme } from '../config/theme';

export default function RootLayout() {
  const theme = darkTheme;

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="teacher-login"
        options={{
          title: 'Login Professor',
        }}
      />
      <Stack.Screen
        name="student-login"
        options={{
          title: 'Login Aluno',
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="create-class"
        options={{
          title: 'Criar Aula',
        }}
      />
      <Stack.Screen
        name="edit-class/[id]"
        options={{
          title: 'Editar Aula',
        }}
      />
      <Stack.Screen
        name="enroll-student"
        options={{
          title: 'Matricular Alunos',
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
