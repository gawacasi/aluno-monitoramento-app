import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getAuthState } from '../../services/auth';
import { deleteClass, getClassById } from '../../services/storage';

export default function ClassDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [classData, setClassData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
    loadClass();
  }, [id]);

  const checkAuth = async () => {
    try {
      const user = await getAuthState();
      setUser(user);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      Alert.alert('Erro', 'Não foi possível verificar sua autenticação');
      router.replace('/login');
    }
  };

  const loadClass = async () => {
    try {
      const data = await getClassById(id as string);
      if (!data) {
        throw new Error('Turma não encontrada');
      }
      setClassData(data);
    } catch (error) {
      console.error('Erro ao carregar turma:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da turma');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta turma? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!user || user.type !== 'professor') {
                throw new Error('Apenas professores podem excluir turmas');
              }

              setDeleting(true);
              const success = await deleteClass(id as string);

              if (!success) {
                throw new Error('Não foi possível excluir a turma');
              }

              Alert.alert('Sucesso', 'Turma excluída com sucesso!', [
                {
                  text: 'OK',
                  onPress: () => router.back(),
                },
              ]);
            } catch (error) {
              console.error('Erro ao excluir turma:', error);
              Alert.alert('Erro', 'Não foi possível excluir a turma');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!classData) {
    return null;
  }

  const isProfessor = user?.type === 'professor';

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="book" size={40} color="#007AFF" />
          <Text style={styles.title}>{classData.name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{classData.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>
          <View style={styles.infoRow}>
            <Ionicons name="people" size={20} color="#666" />
            <Text style={styles.infoText}>
              {classData.enrollments.length} alunos matriculados
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="person" size={20} color="#666" />
            <Text style={styles.infoText}>
              Professor: {classData.professor.name}
            </Text>
          </View>
        </View>

        {isProfessor && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => router.push(`/edit-class/${id}`)}
            >
              <Ionicons name="create" size={20} color="#fff" />
              <Text style={styles.buttonText}>Editar Turma</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.enrollButton]}
              onPress={() => router.push(`/enroll-students/${id}`)}
            >
              <Ionicons name="people" size={20} color="#fff" />
              <Text style={styles.buttonText}>Matricular Alunos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="trash" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Excluir Turma</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  actions: {
    gap: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 8,
    gap: 10,
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  enrollButton: {
    backgroundColor: '#34C759',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 