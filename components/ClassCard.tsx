import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ClassCardProps {
  id: string;
  name: string;
  professor: string;
  specialty: string;
  hospital: string;
  schedule: string;
  vacancies: number;
  enrolled: number;
  onPress?: () => void;
}

export function ClassCard({ 
  name, 
  professor, 
  specialty, 
  hospital, 
  schedule, 
  vacancies, 
  enrolled,
  onPress 
}: ClassCardProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          {name}
        </Text>
        
        <Text style={[styles.info, { color: theme.textSecondary }]}>
          Professor: {professor}
        </Text>
        
        <Text style={[styles.info, { color: theme.textSecondary }]}>
          Especialidade: {specialty}
        </Text>
        
        <Text style={[styles.info, { color: theme.textSecondary }]}>
          Hospital: {hospital}
        </Text>
        
        <Text style={[styles.info, { color: theme.textSecondary }]}>
          Horário: {schedule}
        </Text>
        
        <Text style={[styles.vacancies, { color: theme.primary }]}>
          Vagas: {enrolled}/{vacancies}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    marginBottom: 5,
  },
  vacancies: {
    fontSize: 14,
    marginTop: 10,
  },
}); 