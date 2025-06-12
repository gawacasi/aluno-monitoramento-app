import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getUserByEmail, initializeMockUsers, saveAuthState } from '../../services/storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    setup();
  }, []);

  const setup = async () => {
    try {
      setInitializing(true);
      console.log('Iniciando setup...');

      // Inicializar usuários de teste
      const users = await initializeMockUsers();
      console.log('Usuários de teste inicializados:', users);

      if (!users || users.length === 0) {
        throw new Error('Falha ao inicializar usuários de teste');
      }

      // Verificar autenticação
      const session = await AsyncStorage.getItem('@session');
      if (session) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Erro durante a configuração:', error);
      Alert.alert(
        'Erro',
        'Erro ao inicializar o aplicativo. Por favor, recarregue a página.',
        [
          {
            text: 'Recarregar',
            onPress: () => setup()
          }
        ]
      );
    } finally {
      setInitializing(false);
    }
  };

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos');
        return;
      }

      if (!email.includes('@')) {
        Alert.alert('Erro', 'Digite um e-mail válido');
        return;
      }

      setLoading(true);
      const user = await getUserByEmail(email);

      if (!user) {
        throw new Error('Email não encontrado');
      }

      if (user.password !== password) {
        throw new Error('Senha incorreta');
      }

      // Salvar estado de autenticação
      await saveAuthState(user);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      
      // Mostrar mensagem de erro específica
      if (error.message === 'Email não encontrado') {
        Alert.alert('Erro', 'Email não encontrado. Por favor, verifique o email digitado.');
      } else if (error.message === 'Senha incorreta') {
        Alert.alert('Erro', 'Senha incorreta. Por favor, verifique a senha digitada.');
      } else {
        Alert.alert('Erro', 'Não foi possível fazer login. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Inicializando...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="log-in" size={40} color="#007AFF" />
          <Text style={styles.title}>Login</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              placeholder="Digite seu e-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push('/register')}
            disabled={loading}
          >
            <Text style={styles.linkText}>
              Não tem uma conta? Cadastre-se
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
  },
  form: {
    gap: 20,
    width: '100%',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
}); 