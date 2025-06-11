import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { UserCard } from './UserCard';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'professor' | 'aluno';
}

interface UserListProps {
  users: User[];
  onUserPress?: (user: User) => void;
}

export function UserList({ users, onUserPress }: UserListProps) {
  const theme = useTheme();

  if (users.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          Nenhum usuário encontrado
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <UserCard
          id={item.id}
          name={item.name}
          email={item.email}
          type={item.type}
          onPress={() => onUserPress?.(item)}
        />
      )}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 