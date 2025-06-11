import { useTheme } from '@/hooks/useTheme';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  mode: 'date' | 'time';
  label: string;
}

export function CustomDateTimePicker({ value, onChange, mode, label }: DateTimePickerProps) {
  const { colors } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  const handleConfirm = (date: Date) => {
    onChange(date);
    setIsVisible(false);
  };

  const formatDate = (date: Date) => {
    if (mode === 'date') {
      return date.toLocaleDateString('pt-BR');
    }
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.card }]}
        onPress={() => setIsVisible(true)}
      >
        <ThemedText style={[styles.buttonText, { color: colors.text }]}>
          {formatDate(value)}
        </ThemedText>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isVisible}
        mode={mode}
        onConfirm={handleConfirm}
        onCancel={() => setIsVisible(false)}
        date={value}
        locale="pt-BR"
        is24Hour={true}
        minimumDate={mode === 'date' ? new Date() : undefined}
        buttonTextColorIOS={colors.primary}
        headerTextIOS={`Selecione ${mode === 'date' ? 'a data' : 'o horário'}`}
        confirmTextIOS="Confirmar"
        cancelTextIOS="Cancelar"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
}); 