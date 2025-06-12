import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { darkTheme, lightTheme } from '../../constants/Colors';
import { useTheme } from '../../contexts/ThemeContext';
import { getAuthState, logout } from '../../services/auth';
import { User, updateUser } from '../../services/storage';

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Usuário não encontrado</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.buttonText}>Voltar para o login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={100} color={colors.primary} />
        </View>

        {editing ? (
          <>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text
              }]}
              placeholder="Nome"
              placeholderTextColor={colors.text + '80'}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            />
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text
              }]}
              placeholder="Email"
              placeholderTextColor={colors.text + '80'}
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text
              }]}
              placeholder="Senha atual"
              placeholderTextColor={colors.text + '80'}
              value={formData.currentPassword}
              onChangeText={(text) => setFormData(prev => ({ ...prev, currentPassword: text }))}
              secureTextEntry
            />
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text
              }]}
              placeholder="Nova senha (opcional)"
              placeholderTextColor={colors.text + '80'}
              value={formData.newPassword}
              onChangeText={(text) => setFormData(prev => ({ ...prev, newPassword: text }))}
              secureTextEntry
            />
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text
              }]}
              placeholder="Confirmar nova senha"
              placeholderTextColor={colors.text + '80'}
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
            <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
            <Text style={[styles.email, { color: colors.text + '80' }]}>{user.email}</Text>
            <Text style={[styles.type, { color: colors.text + '60' }]}>{user.type === 'professor' ? 'Professor' : 'Aluno'}</Text>
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
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
}); 