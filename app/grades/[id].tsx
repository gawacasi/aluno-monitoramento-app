import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getAuthState } from '../../services/auth';
import { getClassById, getGrades, saveGrade } from '../../services/storage';

interface Student {
  id: string;
  name: string;
  grade: string;
}

export default function GradesScreen() {
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
      const [classData, gradesData] = await Promise.all([
        getClassById(id as string),
        getGrades(id as string),
      ]);

      if (!classData) {
        throw new Error('Turma não encontrada');
      }

      const studentList = classData.enrollments.map(e => ({
        id: e.studentId,
        name: e.student.name,
        grade: gradesData?.grades[e.studentId]?.toString() ?? '',
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

  const handleGradeChange = (studentId: string, value: string) => {
    // Permite apenas números e ponto decimal
    const numericValue = value.replace(/[^0-9.]/g, '');
    // Garante que há apenas um ponto decimal
    const parts = numericValue.split('.');
    const formattedValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
    // Limita a 2 casas decimais
    const finalValue = formattedValue.includes('.') ? formattedValue.split('.')[0] + '.' + formattedValue.split('.')[1].slice(0, 2) : formattedValue;

    setStudents(prev =>
      prev.map(s =>
        s.id === studentId ? { ...s, grade: finalValue } : s
      )
    );
  };

  const handleSave = async () => {
    try {
      if (!user || user.type !== 'professor') {
        throw new Error('Apenas professores podem registrar notas');
      }

      setSaving(true);
      const grades = students.reduce((acc, s) => ({
        ...acc,
        [s.id]: s.grade ? parseFloat(s.grade) : null,
      }), {});

      const success = await saveGrade(id as string, grades);

      if (!success) {
        throw new Error('Não foi possível salvar as notas');
      }

      Alert.alert('Sucesso', 'Notas registradas com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Erro ao salvar notas:', error);
      Alert.alert('Erro', 'Não foi possível salvar as notas');
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
        <Ionicons name="school" size={40} color="#007AFF" />
        <Text style={styles.title}>Registrar Notas</Text>
      </View>

      {students.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle" size={48} color="#666" />
          <Text style={styles.emptyText}>
            Não há alunos matriculados nesta turma.
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
              </View>
              <TextInput
                style={styles.gradeInput}
                value={item.grade}
                onChangeText={(value) => handleGradeChange(item.id, value)}
                placeholder="0.0"
                keyboardType="numeric"
                editable={!saving}
                maxLength={5}
              />
            </View>
          )}
          contentContainerStyle={styles.list}
        />
      )}

      {students.length > 0 && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="save" size={20} color="#fff" />
              <Text style={styles.buttonText}>Salvar Notas</Text>
            </>
          )}
        </TouchableOpacity>
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
  gradeInput: {
    width: 80,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    margin: 20,
    gap: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 