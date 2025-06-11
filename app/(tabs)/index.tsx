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
    const loadData = async () => {
      setLoading(true);
      const authUser = await getAuthState();
      setUser(authUser);
      if (authUser) {
        if (authUser.type === 'professor') {
          const profClasses = await getClassesByProfessor(authUser.id);
          setClasses(profClasses);
        } else {
          const enrollments = await getEnrollmentsByStudent(authUser.id);
          setClasses(enrollments);
        }
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
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
      <Text style={styles.title}>
        {user.type === 'professor' ? 'Minhas Turmas' : 'Minhas Matrículas'}
      </Text>
      {classes.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma turma encontrada.</Text>
      ) : (
        <FlatList
          data={classes}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.classCard}>
              <Text style={styles.classTitle}>{item.name}</Text>
              <Text style={styles.classDesc}>{item.description}</Text>
            </View>
          )}
        />
      )}
      {user.type === 'professor' && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/create-class')}
        >
          <Text style={styles.buttonText}>Criar Nova Turma</Text>
        </TouchableOpacity>
      )}
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
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
  },
  classCard: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  classTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  classDesc: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
