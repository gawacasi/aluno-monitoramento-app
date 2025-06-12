import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getAuthState } from '../../services/auth';
import { getClassById, getComments, saveComment } from '../../services/storage';

interface Comment {
  id: string;
  text: string;
  author: {
    id: string;
    name: string;
    type: string;
  };
  createdAt: string;
}

export default function CommentsScreen() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
    loadData();
  }, [id]);

  const checkAuth = async () => {
    try {
      const user = await getAuthState();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      setUser(user);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      Alert.alert('Erro', 'Não foi possível verificar sua autenticação');
      router.replace('/login');
    }
  };

  const loadData = async () => {
    try {
      const [classData, commentsData] = await Promise.all([
        getClassById(id as string),
        getComments(id as string),
      ]);

      if (!classData) {
        throw new Error('Turma não encontrada');
      }

      setComments(commentsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      if (!newComment.trim()) {
        Alert.alert('Erro', 'Digite um comentário');
        return;
      }

      setSaving(true);
      const success = await saveComment(id as string, {
        text: newComment.trim(),
        authorId: user.id,
      });

      if (!success) {
        throw new Error('Não foi possível salvar o comentário');
      }

      setNewComment('');
      loadData();
    } catch (error) {
      console.error('Erro ao salvar comentário:', error);
      Alert.alert('Erro', 'Não foi possível salvar o comentário');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="chatbubbles" size={40} color="#007AFF" />
        <Text style={styles.title}>Comentários</Text>
      </View>

      {comments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubble-outline" size={48} color="#666" />
          <Text style={styles.emptyText}>
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </Text>
        </View>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <View style={styles.authorInfo}>
                  <Ionicons
                    name={item.author.type === 'professor' ? 'person' : 'school'}
                    size={16}
                    color="#666"
                  />
                  <Text style={styles.authorName}>{item.author.name}</Text>
                </View>
                <Text style={styles.commentDate}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.commentText}>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={styles.list}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Digite seu comentário..."
          multiline
          editable={!saving}
          maxLength={500}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSubmit}
          disabled={saving || !newComment.trim()}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Ionicons name="send" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  list: {
    padding: 20,
  },
  commentCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  commentDate: {
    fontSize: 14,
    color: '#666',
  },
  commentText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
}); 