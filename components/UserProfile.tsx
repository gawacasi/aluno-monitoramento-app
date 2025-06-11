import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface UserProfileProps {
  name: string;
  email: string;
  type: 'professor' | 'aluno';
  onLogout?: () => void;
}

export function UserProfile({ 
  name, 
  email, 
  type,
  onLogout 
}: UserProfileProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          {name}
        </Text>
        
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {type === 'professor' ? 'Professor' : 'Aluno'}
        </Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          Email
        </Text>
        
        <Text style={[styles.info, { color: theme.text }]}>
          {email}
        </Text>
      </View>
      
      {onLogout && (
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: theme.error }]}
          onPress={onLogout}
        >
          <Text style={styles.logoutButtonText}>
            Sair
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
  },
  logoutButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 