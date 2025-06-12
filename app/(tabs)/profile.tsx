import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getAuthState, logout } from '../../services/auth';
import { User, updateUser } from '../../services/storage';

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await getAuthState();
      setUser(user);
      if (user) {
        setFormData(prev => ({
          ...prev,
          name: user.name,
          email: user.email,
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Não foi possível fazer logout');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Validar senha se estiver alterando
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          Alert.alert('Erro', 'As senhas não coincidem');
          return;
        }
        if (!formData.currentPassword) {
          Alert.alert('Erro', 'Digite sua senha atual');
          return;
        }
      }

      const updatedUser = await updateUser(user.id, {
        name: formData.name,
        email: formData.email,
        ...(formData.newPassword && { password: formData.newPassword }),
      });

      if (updatedUser) {
        setUser(updatedUser);
        setEditing(false);
        Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
      } else {
        throw new Error('Não foi possível atualizar os dados');
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      Alert.alert('Erro', 'Não foi possível atualizar os dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
    setEditing(false);
  };

  if (loading && !user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Usuário não encontrado</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.buttonText}>Voltar para o login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={100} color="#007AFF" />
        </View>

        {editing ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Senha atual"
              value={formData.currentPassword}
              onChangeText={(text) => setFormData(prev => ({ ...prev, currentPassword: text }))}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Nova senha (opcional)"
              value={formData.newPassword}
              onChangeText={(text) => setFormData(prev => ({ ...prev, newPassword: text }))}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirmar nova senha"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
              secureTextEntry
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.type}>{user.type === 'professor' ? 'Professor' : 'Aluno'}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEdit}>
                <Text style={styles.buttonText}>Editar Perfil</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
                <Text style={styles.buttonText}>Sair</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButton: {
    backgroundColor: '#8E8E93',
  },
  saveButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
}); 