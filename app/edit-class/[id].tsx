import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getAuthState } from '../../services/auth';
import { getClassById, updateClass } from '../../services/storage';

interface ClassData {
  name: string;
  description: string;
  maxStudents: string;
}

export default function EditClassScreen() {
  const { id } = useLocalSearchParams();
  const [formData, setFormData] = useState<ClassData>({
    name: '',
    description: '',
    maxStudents: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
    loadClass();
  }, [id]);

  const checkAuth = async () => {
    const user = await getAuthState();
    setUser(user);
  };

  const loadClass = async () => {
    try {
      const classData = await getClassById(id as string);
      if (!classData) {
        throw new Error('Turma não encontrada');
      }

      setFormData({
        name: classData.name,
        description: classData.description,
        maxStudents: classData.maxStudents.toString(),
      });
    } catch (error) {
      console.error('Erro ao carregar turma:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da turma');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.description || !formData.maxStudents) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos');
        return;
      }

      if (!user || user.type !== 'professor') {
        throw new Error('Apenas professores podem editar turmas');
      }

      setSaving(true);
      const updatedClass = await updateClass(id as string, {
        name: formData.name,
        description: formData.description,
        maxStudents: parseInt(formData.maxStudents),
      });

      if (!updatedClass) {
        throw new Error('Não foi possível atualizar a turma');
      }

      Alert.alert('Sucesso', 'Turma atualizada com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Erro ao atualizar turma:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a turma');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="create" size={40} color="#007AFF" />
          <Text style={styles.title}>Editar Turma</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome da Turma</Text>
            <TextInput
              placeholder="Digite o nome da turma"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              style={styles.input}
              editable={!saving}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              placeholder="Digite a descrição da turma"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={4}
              editable={!saving}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número Máximo de Alunos</Text>
            <TextInput
              placeholder="Digite o número máximo de alunos"
              value={formData.maxStudents}
              onChangeText={(text) => setFormData({ ...formData, maxStudents: text })}
              keyboardType="numeric"
              style={styles.input}
              editable={!saving}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
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
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  button: {
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 