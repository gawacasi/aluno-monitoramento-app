import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Calendar from '../../components/Calendar';
import { darkTheme, lightTheme } from '../../constants/Colors';
import { useTheme } from '../../contexts/ThemeContext';
import { getAuthState, getClassesByProfessor, getEnrollmentsByStudent, sampleClasses } from '../../services/storage';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'professor' | 'aluno';
}

interface Class {
  id: string;
  name: string;
  description: string;
  schedule: string;
}

export default function HomeScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const authState = await getAuthState();
      if (authState?.user) {
        setUser(authState.user);
        if (authState.user.role === 'professor') {
          const professorClasses = await getClassesByProfessor(authState.user.id);
          setClasses(professorClasses);
        } else {
          const studentEnrollments = await getEnrollmentsByStudent(authState.user.id);
          setClasses(studentEnrollments);
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
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.message, { color: colors.text }]}>
          Faça login para ver suas atividades
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Seção do Calendário */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Calendário de Atividades
          </Text>
          <Calendar classes={sampleClasses} />
        </View>

        {/* Seção de Turmas */}
        {user.role === 'professor' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Minhas Turmas
            </Text>
            {classes.length > 0 ? (
              <FlatList
                data={classes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.classCard, { backgroundColor: colors.card }]}
                    onPress={() => {
                      // Navegar para detalhes da turma
                    }}
                  >
                    <Text style={[styles.className, { color: colors.text }]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.classDescription, { color: colors.textSecondary }]}>
                      {item.description}
                    </Text>
                    <Text style={[styles.classSchedule, { color: colors.textSecondary }]}>
                      {item.schedule}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
                Você ainda não tem turmas cadastradas
              </Text>
            )}
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                // Navegar para tela de criar turma
              }}
            >
              <Text style={styles.createButtonText}>Criar Nova Turma</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  classCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  className: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  classDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  classSchedule: {
    fontSize: 12,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 20,
  },
  createButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

