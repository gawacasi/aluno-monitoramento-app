import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface EnrollmentCardProps {
  id: string;
  className: string;
  professor: string;
  status: 'pending' | 'approved' | 'rejected';
  onPress?: () => void;
  onCancel?: () => void;
}

export function EnrollmentCard({ 
  className, 
  professor, 
  status,
  onPress,
  onCancel
}: EnrollmentCardProps) {
  const theme = useTheme();

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return theme.warning;
      case 'approved':
        return theme.success;
      case 'rejected':
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      default:
        return status;
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        <Text style={[styles.title, { color: theme.text }]}>
          {className}
        </Text>
        
        <Text style={[styles.info, { color: theme.textSecondary }]}>
          Professor: {professor}
        </Text>
        
        <View style={styles.statusContainer}>
          <Text style={[styles.status, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
          
          {status === 'pending' && onCancel && (
            <TouchableOpacity 
              style={[styles.cancelButton, { backgroundColor: theme.error }]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>
                Cancelar
              </Text>
            </TouchableOpacity>
          )}
        </View>
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
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 4,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 