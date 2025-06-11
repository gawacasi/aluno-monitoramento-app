import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getAuthState } from '../../services/auth';
import { getClasses, saveEnrollment } from '../../services/storage';

export default function AvailableClassesScreen() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const allClasses = await getClasses();
      setClasses(allClasses);
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (classId: string) => {
    try {
      const { user } = await getAuthState();
      
      if (!user || user.type !== 'aluno') {
        throw new Error('Apenas alunos podem se matricular');
      }

      await saveEnrollment({
        studentId: user.id,
        classId,
        status: 'active',
      });

      Alert.alert('Sucesso', 'Matrícula realizada com sucesso!');
      router.back();
    } catch (error) {
      console.error('Erro ao realizar matrícula:', error);
      Alert.alert('Erro', 'Não foi possível realizar a matrícula');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Turmas Disponíveis</Text>

      {classes.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma turma disponível</Text>
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.classCard}>
              <Text style={styles.className}>{item.name}</Text>
              <Text style={styles.classDescription}>{item.description}</Text>
              <TouchableOpacity
                style={styles.enrollButton}
                onPress={() => handleEnroll(item.id)}
              >
                <Text style={styles.enrollButtonText}>Matricular</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  classCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  classDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  enrollButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 