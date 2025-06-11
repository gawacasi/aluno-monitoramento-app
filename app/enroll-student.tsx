import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { getAuthState } from '../services/auth';
import { getClassById, getEnrollmentsByClass, getUsers, saveEnrollment, User } from '../services/storage';

export default function EnrollStudentScreen() {
  const { classId } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<User[]>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<string[]>([]);
  const theme = useTheme();

  useEffect(() => {
    loadData();
  }, [classId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const { user } = await getAuthState();
      
      if (!user || user.type !== 'professor') {
        throw new Error('Apenas professores podem gerenciar matrículas');
      }

      const classData = await getClassById(classId as string);
      if (!classData) {
        throw new Error('Turma não encontrada');
      }

      // Carregar todos os alunos
      const allUsers = await getUsers();
      const allStudents = allUsers.filter(u => u.type === 'aluno');
      setStudents(allStudents);

      // Carregar alunos já matriculados
      const enrollments = await getEnrollmentsByClass(classId as string);
      setEnrolledStudents(enrollments.map(e => e.studentId));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (studentId: string) => {
    try {
      setLoading(true);
      const { user } = await getAuthState();
      
      if (!user || user.type !== 'professor') {
        throw new Error('Apenas professores podem gerenciar matrículas');
      }

      await saveEnrollment({
        studentId,
        classId: classId as string,
        status: 'active'
      });

      Alert.alert('Sucesso', 'Aluno matriculado com sucesso!');
      loadData(); // Recarregar dados
    } catch (error) {
      console.error('Erro ao matricular aluno:', error);
      Alert.alert('Erro', 'Não foi possível matricular o aluno');
    } finally {
      setLoading(false);
    }
  };

  const renderStudent = ({ item }: { item: User }) => {
    const isEnrolled = enrolledStudents.includes(item.id);

    return (
      <View style={[styles.studentItem, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.studentInfo}>
          <Text style={[styles.studentName, { color: theme.text }]}>{item.name}</Text>
          <Text style={[styles.studentEmail, { color: theme.textSecondary }]}>{item.email}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.enrollButton,
            isEnrolled && styles.enrolledButton,
            { backgroundColor: isEnrolled ? theme.success : theme.primary }
          ]}
          onPress={() => !isEnrolled && handleEnroll(item.id)}
          disabled={isEnrolled || loading}
        >
          <Text style={styles.buttonText}>
            {isEnrolled ? 'Matriculado' : 'Matricular'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Matricular Alunos</Text>
      
      <FlatList
        data={students}
        renderItem={renderStudent}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Nenhum aluno disponível para matrícula
            </Text>
          </View>
        }
      />
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
  list: {
    gap: 10,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentEmail: {
    fontSize: 14,
  },
  enrollButton: {
    padding: 10,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  enrolledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 