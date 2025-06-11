import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface UserTypeSelectorProps {
  selectedType: 'professor' | 'aluno';
  onTypeChange: (type: 'professor' | 'aluno') => void;
}

export function UserTypeSelector({ 
  selectedType, 
  onTypeChange 
}: UserTypeSelectorProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: theme.card },
          selectedType === 'professor' && { backgroundColor: theme.primary }
        ]}
        onPress={() => onTypeChange('professor')}
      >
        <Text style={[
          styles.buttonText,
          { color: theme.textSecondary },
          selectedType === 'professor' && { color: '#fff' }
        ]}>
          Professor
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: theme.card },
          selectedType === 'aluno' && { backgroundColor: theme.primary }
        ]}
        onPress={() => onTypeChange('aluno')}
      >
        <Text style={[
          styles.buttonText,
          { color: theme.textSecondary },
          selectedType === 'aluno' && { color: '#fff' }
        ]}>
          Aluno
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 