import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getAuthState } from '../../services/auth';
import { saveClass } from '../../services/storage';

export default function CreateClassScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxStudents, setMaxStudents] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const user = await getAuthState();
    setUser(user);
  };

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

  if (!user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Nova Turma</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da Turma"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <TextInput
        style={styles.input}
        placeholder="Número máximo de alunos"
        value={maxStudents}
        onChangeText={setMaxStudents}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Criar Turma</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
}); 