import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getAuthState } from '../../services/auth';
import { deleteClass, getClassesByProfessor } from '../../services/storage';

interface Class {
  id: string;
  name: string;
  description: string;
  location: string;
  maxStudents: number;
  enrollments: any[];
  dates: string[];
}

export default function MyClassesScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);

  const loadClasses = async () => {
    try {
      const { user } = await getAuthState();
      if (!user || user.type !== 'professor') {
        throw new Error('Apenas professores podem ver suas turmas');
      }

      const professorClasses = await getClassesByProfessor(user.id);
      setClasses(professorClasses);
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as turmas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleDeleteClass = async (classId: string) => {
    Alert.alert(
      'Excluir Turma',
      'Tem certeza que deseja excluir esta turma?',
      [
        {
          text: 'Não',
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              await deleteClass(classId);
              await loadClasses();
              Alert.alert('Sucesso', 'Turma excluída com sucesso');
            } catch (error) {
              console.error('Erro ao excluir turma:', error);
              Alert.alert('Erro', 'Não foi possível excluir a turma');
            }
          },
        },
      ]
    );
  };

  const renderClassCard = ({ item }: { item: Class }) => (
    <View style={styles.classCard}>
      <View style={styles.classHeader}>
        <Text style={styles.className}>{item.name}</Text>
        <View style={styles.classActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#007AFF' }]}
            onPress={() => router.push(`/edit-class/${item.id}`)}
          >
            <Text style={styles.actionButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#34C759' }]}
            onPress={() => router.push(`/enroll-student?classId=${item.id}`)}
          >
            <Text style={styles.actionButtonText}>Matricular</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#FF3B30' }]}
            onPress={() => handleDeleteClass(item.id)}
          >
            <Text style={styles.actionButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.classInfo}>
        <FontAwesome name="map-marker" size={14} color="#666" /> {item.location}
      </Text>
      <Text style={styles.classInfo}>
        <FontAwesome name="users" size={14} color="#666" /> {item.enrollments.length}/{item.maxStudents} alunos
      </Text>
      <Text style={styles.classInfo}>
        <FontAwesome name="calendar" size={14} color="#666" /> {item.dates.length} datas
      </Text>
      <Text style={styles.classDescription}>{item.description}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando turmas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="chalkboard-teacher" size={40} color="#007AFF" />
        <Text style={styles.title}>Minhas Turmas</Text>
      </View>

      <FlatList
        data={classes}
        renderItem={renderClassCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadClasses();
            }}
            colors={['#007AFF']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="chalkboard" size={50} color="#666" />
            <Text style={styles.emptyText}>
              Você ainda não tem turmas cadastradas
            </Text>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: '#007AFF' }]}
              onPress={() => router.push('/create-class')}
            >
              <Text style={styles.createButtonText}>Criar Nova Turma</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  list: {
    gap: 15,
  },
  classCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  classActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  classInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  classDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  createButton: {
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 