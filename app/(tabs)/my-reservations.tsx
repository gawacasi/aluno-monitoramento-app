import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { darkTheme, lightTheme } from '../../constants/Colors';
import { useTheme } from '../../contexts/ThemeContext';
import { getAuthState } from '../../services/auth';
import { deleteEnrollment, getEnrollmentsByStudent } from '../../services/storage';

interface Enrollment {
  id: string;
  classId: string;
  className: string;
  professorName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function MyReservationsScreen() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      const { user } = await getAuthState();
      if (!user || user.type !== 'aluno') {
        throw new Error('Apenas alunos podem ver suas matrículas');
      }

      const data = await getEnrollmentsByStudent(user.id);
      setEnrollments(data);
    } catch (error) {
      console.error('Erro ao carregar matrículas:', error);
      Alert.alert('Erro', 'Não foi possível carregar suas matrículas');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (enrollmentId: string) => {
    try {
      await deleteEnrollment(enrollmentId);
      await loadEnrollments();
      Alert.alert('Sucesso', 'Matrícula cancelada com sucesso');
    } catch (error) {
      console.error('Erro ao cancelar matrícula:', error);
      Alert.alert('Erro', 'Não foi possível cancelar a matrícula');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return colors.success;
      case 'rejected':
        return colors.error;
      default:
        return colors.warning;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovada';
      case 'rejected':
        return 'Rejeitada';
      default:
        return 'Pendente';
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
      <Text style={[styles.title, { color: colors.text }]}>Minhas Matrículas</Text>

      {enrollments.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.text + '80' }]}>Você ainda não tem matrículas</Text>
      ) : (
        <FlatList
          data={enrollments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.className, { color: colors.text }]}>{item.className}</Text>
                <Text
                  style={[
                    styles.status,
                    { color: getStatusColor(item.status) },
                  ]}
                >
                  {getStatusText(item.status)}
                </Text>
              </View>

              <Text style={[styles.professorName, { color: colors.text + '80' }]}>
                Professor: {item.professorName}
              </Text>

              {item.status === 'pending' && (
                <TouchableOpacity
                  style={[styles.cancelButton, { backgroundColor: colors.error }]}
                  onPress={() => handleCancel(item.id)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar Matrícula</Text>
                </TouchableOpacity>
              )}
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
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  card: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  professorName: {
    fontSize: 14,
  },
  cancelButton: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 