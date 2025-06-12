import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getAuthState } from '../../services/auth';
import { getAttendance, getClassById, saveAttendance } from '../../services/storage';

interface Student {
  id: string;
  name: string;
  present: boolean;
}

export default function AttendanceScreen() {
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
      const [classData, attendanceData] = await Promise.all([
        getClassById(id as string),
        getAttendance(id as string),
      ]);

      if (!classData) {
        throw new Error('Turma não encontrada');
      }

      const studentList = classData.enrollments.map(e => ({
        id: e.studentId,
        name: e.student.name,
        present: attendanceData?.students.includes(e.studentId) ?? false,
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

  const handleToggleAttendance = (studentId: string) => {
    setStudents(prev =>
      prev.map(s =>
        s.id === studentId ? { ...s, present: !s.present } : s
      )
    );
  };

  const handleSave = async () => {
    try {
      if (!user || user.type !== 'professor') {
        throw new Error('Apenas professores podem registrar presença');
      }

      setSaving(true);
      const presentStudents = students
        .filter(s => s.present)
        .map(s => s.id);

      const success = await saveAttendance(id as string, presentStudents);

      if (!success) {
        throw new Error('Não foi possível salvar a presença');
      }

      Alert.alert('Sucesso', 'Presença registrada com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Erro ao salvar presença:', error);
      Alert.alert('Erro', 'Não foi possível salvar a presença');
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
        <Ionicons name="calendar" size={40} color="#007AFF" />
        <Text style={styles.title}>Registrar Presença</Text>
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
            <TouchableOpacity
              style={styles.studentCard}
              onPress={() => handleToggleAttendance(item.id)}
            >
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{item.name}</Text>
              </View>
              <View style={[
                styles.attendanceIndicator,
                item.present && styles.presentIndicator,
              ]}>
                <Ionicons
                  name={item.present ? 'checkmark' : 'close'}
                  size={24}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>
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
              <Text style={styles.buttonText}>Salvar Presença</Text>
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
  attendanceIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  presentIndicator: {
    backgroundColor: '#34C759',
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