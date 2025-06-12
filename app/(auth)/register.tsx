import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { register } from '../../services/auth';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [type, setType] = useState<'professor' | 'aluno'>('aluno');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      if (!name || !email || !password || !confirmPassword) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos');
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Erro', 'As senhas não coincidem');
        return;
      }

      if (password.length < 6) {
        Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
        return;
      }

      if (!email.includes('@')) {
        Alert.alert('Erro', 'Digite um e-mail válido');
        return;
      }

      setLoading(true);
      const user = await register({
        name,
        email,
        password,
        type,
      });

      if (!user) {
        throw new Error('Não foi possível criar a conta');
      }

      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.replace('/login'),
        },
      ]);
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      Alert.alert('Erro', 'Não foi possível criar a conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="person-add" size={40} color="#007AFF" />
          <Text style={styles.title}>Criar Conta</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              placeholder="Digite seu nome"
              value={name}
              onChangeText={setName}
              style={styles.input}
              editable={!loading}
            />
          </View>

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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar Senha</Text>
            <TextInput
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de Conta</Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'aluno' && styles.selectedTypeButton,
                ]}
                onPress={() => setType('aluno')}
                disabled={loading}
              >
                <Text style={[
                  styles.typeButtonText,
                  type === 'aluno' && styles.selectedTypeButtonText,
                ]}>
                  Aluno
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'professor' && styles.selectedTypeButton,
                ]}
                onPress={() => setType('professor')}
                disabled={loading}
              >
                <Text style={[
                  styles.typeButtonText,
                  type === 'professor' && styles.selectedTypeButtonText,
                ]}>
                  Professor
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Criar Conta</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push('/login')}
            disabled={loading}
          >
            <Text style={styles.linkText}>
              Já tem uma conta? Faça login
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
  typeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  selectedTypeButton: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  selectedTypeButtonText: {
    color: '#fff',
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
}); 