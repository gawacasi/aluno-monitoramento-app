import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { darkTheme, lightTheme } from '../constants/Colors';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeSelector } from './ThemeSelector';

export default function Header() {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      <View style={styles.logoContainer}>
        <Ionicons name="school" size={24} color={colors.primary} />
        <Text style={[styles.logoText, { color: colors.primary }]}>EUPHO</Text>
      </View>
      <ThemeSelector />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 