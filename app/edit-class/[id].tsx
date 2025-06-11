import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { getAuthState } from '../../services/auth';
import { getClassById, saveClass } from '../../services/storage';

interface ClassData {
  name: string;
  description: string;
  location: string;
  maxStudents: string;
  selectedDates: { [key: string]: boolean };
}

export default function EditClassScreen() {
  const { id } = useLocalSearchParams();
  const [formData, setFormData] = useState<ClassData>({
    name: '',
    description: '',
    location: '',
    maxStudents: '',
    selectedDates: {},
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadClass();
  }, [id]);

  const loadClass = async () => {
    try {
      const classData = await getClassById(id as string);
      if (!classData) {
        throw new Error('Turma não encontrada');
      }

      setFormData({
        name: classData.name,
        description: classData.description,
        location: classData.location,
        maxStudents: classData.maxStudents.toString(),
        selectedDates: classData.dates.reduce((acc, date) => ({
          ...acc,
          [date]: true,
        }), {}),
      });
    } catch (error) {
      console.error('Erro ao carregar turma:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da turma');
      router.back();
    }
  };

  const handleDateSelect = (date: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDates: {
        ...prev.selectedDates,
        [date]: !prev.selectedDates[date],
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.description || !formData.location || !formData.maxStudents) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos');
        return;
      }

      const selectedDatesArray = Object.entries(formData.selectedDates)
        .filter(([_, selected]) => selected)
        .map(([date]) => date);

      if (selectedDatesArray.length === 0) {
        Alert.alert('Erro', 'Selecione pelo menos uma data para a turma');
        return;
      }

      setSaving(true);
      const { user } = await getAuthState();
      
      if (!user || user.type !== 'professor') {
        throw new Error('Apenas professores podem editar turmas');
      }

      await saveClass({
        id: id as string,
        name: formData.name,
        description: formData.description,
        location: formData.location,
        maxStudents: parseInt(formData.maxStudents),
        professorId: user.id,
        dates: selectedDatesArray,
      });

      Alert.alert('Sucesso', 'Turma atualizada com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Erro ao atualizar turma:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a turma');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <FontAwesome name="edit" size={40} color="#007AFF" />
          <Text style={styles.title}>Editar Turma</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome da Turma</Text>
            <TextInput
              placeholder="Digite o nome da turma"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              style={styles.input}
              editable={!saving}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              placeholder="Digite a descrição da turma"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={4}
              editable={!saving}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Local</Text>
            <TextInput
              placeholder="Digite o local da turma"
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
              style={styles.input}
              editable={!saving}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Número Máximo de Alunos</Text>
            <TextInput
              placeholder="Digite o número máximo de alunos"
              value={formData.maxStudents}
              onChangeText={(text) => setFormData({ ...formData, maxStudents: text })}
              keyboardType="numeric"
              style={styles.input}
              editable={!saving}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#007AFF' }]}
            onPress={handleSubmit}
            disabled={saving}
          >
            <Text style={styles.buttonText}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 