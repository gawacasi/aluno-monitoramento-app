import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { saveClass } from '../../services/storage';

export default function CreateClassScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxStudents, setMaxStudents] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const theme = useTheme();

  const handleCreate = async () => {
    if (!name || !description || !maxStudents) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (!user || user.type !== 'professor') {
      Alert.alert('Erro', 'Apenas professores podem criar turmas');
      return;
    }

    setLoading(true);
    try {
      const newClass = await saveClass({
        name,
        description,
        professorId: user.id,
        maxStudents: parseInt(maxStudents, 10),
      });

      if (!newClass) {
        throw new Error('Não foi possível criar a turma');
      }
      
      Alert.alert('Sucesso', 'Turma criada com sucesso!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Erro ao criar turma:', error);
      Alert.alert('Erro', 'Não foi possível criar a turma. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Criar Nova Turma</Text>

      <TextInput
        style={[styles.input, { 
          backgroundColor: theme.card,
          color: theme.text,
          borderColor: theme.border
        }]}
        placeholder="Nome da Turma"
        placeholderTextColor={theme.textSecondary}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[styles.input, { 
          backgroundColor: theme.card,
          color: theme.text,
          borderColor: theme.border
        }]}
        placeholder="Descrição"
        placeholderTextColor={theme.textSecondary}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <TextInput
        style={[styles.input, { 
          backgroundColor: theme.card,
          color: theme.text,
          borderColor: theme.border
        }]}
        placeholder="Número máximo de alunos"
        placeholderTextColor={theme.textSecondary}
        value={maxStudents}
        onChangeText={setMaxStudents}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleCreate}
        disabled={loading}
      >
        <Text style={[styles.buttonText, { color: theme.background }]}>
          {loading ? 'Criando...' : 'Criar Turma'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 