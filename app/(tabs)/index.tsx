import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getAuthState } from '../../services/auth';
import { getClassesByProfessor, getEnrollmentsByStudent } from '../../services/storage';

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await getAuthState();
      setUser(user);

      if (user) {
        if (user.type === 'professor') {
          const profClasses = await getClassesByProfessor(user.id);
          setClasses(profClasses);
        } else {
          const enrollments = await getEnrollmentsByStudent(user.id);
          setClasses(enrollments);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
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

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Usuário não autenticado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons
            name={user.type === 'professor' ? 'book' : 'school'}
            size={40}
            color="#007AFF"
          />
          <Text style={styles.title}>
            {user.type === 'professor' ? 'Minhas Turmas' : 'Minhas Matrículas'}
          </Text>
        </View>

        {classes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle" size={48} color="#666" />
            <Text style={styles.emptyText}>
              {user.type === 'professor'
                ? 'Você ainda não tem turmas.'
                : 'Você ainda não está matriculado em nenhuma turma.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={classes}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.classCard}
                onPress={() => router.push(`/class-details/${item.id}`)}
              >
                <View style={styles.classInfo}>
                  <Text style={styles.classTitle}>{item.name}</Text>
                  <Text style={styles.classDesc}>{item.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.list}
          />
        )}

        {user.type === 'professor' && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/create-class')}
          >
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.buttonText}>Criar Nova Turma</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
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
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  classInfo: {
    flex: 1,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  classDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  button: {
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
