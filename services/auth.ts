import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/config';
import { User } from '../types/user';
import { FIXED_USERS, getUsers, saveUser } from './storage';

interface Session {
  user: {
    id: string;
    name: string;
    email: string;
    type: 'professor' | 'aluno';
  };
  token: string;
  expiresAt: number;
}

const STORAGE_KEYS = {
  USERS: '@users',
  SESSION: '@session',
};

export async function register(userData: { name: string; email: string; password: string; type: 'professor' | 'aluno' }) {
  const users = await getUsers();
  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  const user = {
    id: uuidv4(),
    ...userData
  };

  await saveUser(user);
  
  // Criar sessão após registro
  const session: Session = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
    },
    token: uuidv4(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 horas
  };

  await AsyncStorage.setItem(config.storage.session, JSON.stringify(session));
  return user;
}

export const login = async (email: string, password: string): Promise<User> => {
  try {
    console.log('Iniciando processo de login...');
    console.log('Email recebido:', email);
    console.log('Senha recebida:', password);

    // Buscar usuário nos usuários fixos
    const user = FIXED_USERS.find(u => u.email === email);
    console.log('Usuário encontrado:', user ? 'Sim' : 'Não');

    if (!user) {
      console.error('Email não encontrado:', email);
      throw new Error('Email não encontrado');
    }

    // Verificar senha
    if (user.password !== password) {
      console.error('Senha incorreta para o usuário:', email);
      throw new Error('Senha incorreta');
    }

    // Criar sessão
    console.log('Criando sessão para o usuário:', user.email);
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
    console.log('Sessão criada com sucesso');

    return user;
  } catch (error) {
    console.error('Erro durante o login:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};

export const getAuthState = async (): Promise<User | null> => {
  try {
    const sessionJson = await AsyncStorage.getItem(STORAGE_KEYS.SESSION);
    if (!sessionJson) return null;
    return JSON.parse(sessionJson);
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return null;
  }
};

export async function refreshSession() {
  const sessionStr = await AsyncStorage.getItem(config.storage.session);
  if (!sessionStr) return null;

  try {
    const session: Session = JSON.parse(sessionStr);
    
    // Atualizar expiração da sessão
    session.expiresAt = Date.now() + (24 * 60 * 60 * 1000);
    await AsyncStorage.setItem(config.storage.session, JSON.stringify(session));
    
    return session.user;
  } catch {
    return null;
  }
} 