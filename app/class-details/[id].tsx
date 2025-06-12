import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getAuthState } from '../../services/auth';
import { getClassById } from '../../services/storage';
import { Class } from '../../types/class';

export default function ClassDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState<Class | null>(null);
  const [userType, setUserType] = useState<'professor' | 'aluno' | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = await getAuthState();
      setUserType(user?.type || null);

      if (!id) {
        throw new Error('ID da turma não fornecido');
      }

      const classInfo = await getClassById(id as string);
      if (!classInfo) {
        throw new Error('Turma não encontrada');
      }

      // Garantir que todos os campos obrigatórios existam
      const completeClassInfo: Class = {
        ...classInfo,
        schedule: classInfo.schedule || [],
        enrollments: classInfo.enrollments || [],
        startDate: classInfo.startDate || new Date().toISOString(),
        endDate: classInfo.endDate || new Date().toISOString(),
        location: classInfo.location || 'Local não definido',
        description: classInfo.description || 'Sem descrição',
      };

      setClassData(completeClassInfo);
    } catch (error) {
      console.error('Erro ao carregar dados da turma:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da turma');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!classData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Turma não encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{classData.name}</Text>
        <Text style={styles.subtitle}>{classData.subject}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={20} color="#666" />
          <Text style={styles.infoText}>
            {new Date(classData.startDate).toLocaleDateString()} - {new Date(classData.endDate).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time" size={20} color="#666" />
          <Text style={styles.infoText}>
            {classData.schedule && classData.schedule.length > 0
              ? classData.schedule.map(s => `${s.day} ${s.startTime}-${s.endTime}`).join(', ')
              : 'Horário não definido'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="people" size={20} color="#666" />
          <Text style={styles.infoText}>
            {classData.enrollments?.length || 0} alunos matriculados
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location" size={20} color="#666" />
          <Text style={styles.infoText}>{classData.location}</Text>
        </View>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>Descrição</Text>
        <Text style={styles.descriptionText}>{classData.description}</Text>
      </View>

      {userType === 'professor' && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/enroll-students/${id}`)}
          >
            <Ionicons name="person-add" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Matricular Alunos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/attendance/${id}`)}
          >
            <Ionicons name="calendar" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Chamada</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/grades/${id}`)}
          >
            <Ionicons name="school" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Notas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/comments/${id}`)}
          >
            <Ionicons name="chatbubble" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Comentários</Text>
          </TouchableOpacity>
        </View>
      )}
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
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  descriptionContainer: {
    padding: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  actionsContainer: {
    padding: 20,
    gap: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
}); 