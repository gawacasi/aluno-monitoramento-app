import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getAuthState } from '../../services/auth';
import { enrollStudent, getClassById, getUsers } from '../../services/storage';

interface Student {
  id: string;
  name: string;
  email: string;
  enrolled: boolean;
}

export default function EnrollStudentsScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
    loadData();
  }, [id]);

  const checkAuth = async () => {
    try {
      const user = await getAuthState();
      if (!user || user.type !== 'professor') {
        throw new Error('Apenas professores podem acessar esta tela');
      }
      setUser(user);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      Alert.alert('Erro', 'Não foi possível verificar sua autenticação');
      router.replace('/login');
    }
  };

  const loadData = async () => {
    try {
      const [classData, allStudents] = await Promise.all([
        getClassById(id as string),
        getUsers(),
      ]);

      if (!classData) {
        throw new Error('Turma não encontrada');
      }

      const enrolledStudentIds = classData.enrollments.map(e => e.studentId);
      const studentList = allStudents
        .filter(s => s.type === 'aluno')
        .map(s => ({
          id: s.id,
          name: s.name,
          email: s.email,
          enrolled: enrolledStudentIds.includes(s.id),
        }));

      setStudents(studentList);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (studentId: string) => {
    try {
      if (!user || user.type !== 'professor') {
        throw new Error('Apenas professores podem matricular alunos');
      }

      setSaving(true);
      const success = await enrollStudent(id as string, studentId);

      if (!success) {
        throw new Error('Não foi possível matricular o aluno');
      }

      setStudents(prev =>
        prev.map(s =>
          s.id === studentId ? { ...s, enrolled: !s.enrolled } : s
        )
      );

      Alert.alert('Sucesso', 'Matrícula atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao matricular aluno:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a matrícula');
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="people" size={40} color="#007AFF" />
        <Text style={styles.title}>Matricular Alunos</Text>
      </View>

      {students.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle" size={48} color="#666" />
          <Text style={styles.emptyText}>
            Não há alunos disponíveis para matrícula.
          </Text>
        </View>
      ) : (
        <FlatList
          data={students}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.studentCard}>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{item.name}</Text>
                <Text style={styles.studentEmail}>{item.email}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.enrollButton,
                  item.enrolled && styles.enrolledButton,
                ]}
                onPress={() => handleEnroll(item.id)}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    {item.enrolled ? 'Desmatricular' : 'Matricular'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  list: {
    padding: 20,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  studentEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  enrollButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  enrolledButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 