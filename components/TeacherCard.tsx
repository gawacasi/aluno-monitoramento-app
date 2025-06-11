import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface TeacherCardProps {
  id: string;
  name: string;
  email: string;
  specialty: string;
  onPress?: () => void;
}

export function TeacherCard({ 
  name, 
  email, 
  specialty,
  onPress 
}: TeacherCardProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          {name}
        </Text>
        
        <Text style={[styles.info, { color: theme.textSecondary }]}>
          {email}
        </Text>
        
        <Text style={[styles.specialty, { color: theme.primary }]}>
          Especialidade: {specialty}
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
  specialty: {
    fontSize: 14,
    marginTop: 5,
  },
}); 