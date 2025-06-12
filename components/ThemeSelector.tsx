import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { darkTheme, lightTheme } from '../constants/Colors';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeSelector = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <TouchableOpacity
        style={[
          styles.option,
          theme === 'light' && styles.selectedOption,
          { backgroundColor: colors.background }
        ]}
        onPress={() => toggleTheme('light')}
      >
        <Ionicons name="sunny" size={20} color={theme === 'light' ? colors.primary : colors.text} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          theme === 'dark' && styles.selectedOption,
          { backgroundColor: colors.background }
        ]}
        onPress={() => toggleTheme('dark')}
      >
        <Ionicons name="moon" size={20} color={theme === 'dark' ? colors.primary : colors.text} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          theme === 'system' && styles.selectedOption,
          { backgroundColor: colors.background }
        ]}
        onPress={() => toggleTheme('system')}
      >
        <Ionicons name="phone-portrait" size={20} color={theme === 'system' ? colors.primary : colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    gap: 8,
    alignSelf: 'center',
    width: 'auto',
  },
  option: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
}); 