import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Ionicons name="school" size={24} color="#007AFF" />
        <Text style={styles.logoText}>EUPHO</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'center',
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
    color: '#007AFF',
  },
}); 