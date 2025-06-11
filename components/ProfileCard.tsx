import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ProfileCardProps {
  name: string;
  email: string;
  type: 'professor' | 'aluno';
  onPress?: () => void;
}

export function ProfileCard({ 
  name, 
  email, 
  type,
  onPress 
}: ProfileCardProps) {
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
        
        <Text style={[styles.type, { color: theme.primary }]}>
          {type === 'professor' ? 'Professor' : 'Aluno'}
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
  type: {
    fontSize: 14,
    marginTop: 5,
  },
}); 