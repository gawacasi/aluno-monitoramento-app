import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { darkTheme, lightTheme } from '../../constants/Colors';
import { useTheme } from '../../contexts/ThemeContext';
import { getAuthState } from '../../services/auth';
import { getClasses, saveEnrollment } from '../../services/storage';

export default function AvailableClassesScreen() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Turmas Disponíveis</Text>

      {classes.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.text + '80' }]}>Nenhuma turma disponível</Text>
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.classCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.className, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.classDescription, { color: colors.text + '80' }]}>{item.description}</Text>
              <TouchableOpacity
                style={[styles.enrollButton, { backgroundColor: colors.primary }]}
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  classCard: {
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
    marginBottom: 10,
  },
  enrollButton: {
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