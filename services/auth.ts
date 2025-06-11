import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/config';
import { getUsers, saveUser } from './storage';

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

export async function login(email: string, password: string) {
  const users = await getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Usuário ou senha inválidos');
  }

  // Criar sessão após login
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

export async function logout() {
  await AsyncStorage.removeItem(config.storage.session);
}

export async function getAuthState() {
  const sessionStr = await AsyncStorage.getItem(config.storage.session);
  if (!sessionStr) return null;

  try {
    const session: Session = JSON.parse(sessionStr);
    
    // Verificar se a sessão expirou
    if (session.expiresAt < Date.now()) {
      await logout();
      return null;
    }

    return session.user;
  } catch {
    return null;
  }
}

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