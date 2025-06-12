import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../config/config';
import { User } from '../types/user';

const STORAGE_KEYS = {
  USERS: '@users',
  SESSION: '@session',
};

// Usuários fixos do sistema
export const FIXED_USERS: User[] = [
  {
    id: '1',
    name: 'Professor Teste',
    email: 'professor@teste.com',
    password: '123456',
    type: 'professor',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Aluno Teste',
    email: 'aluno@teste.com',
    password: '123456',
    type: 'aluno',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Função para gerar ID único
const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Funções auxiliares
const getItem = async <T>(key: string): Promise<T[]> => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Erro ao buscar ${key}:`, error);
    return [];
  }
};

const setItem = async <T>(key: string, data: T[]): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Erro ao salvar ${key}:`, error);
    return false;
  }
};

// Interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  type: 'professor' | 'aluno';
  createdAt: Date;
  updatedAt: Date;
}

export interface Class {
  id: string;
  name: string;
  description: string;
  professorId: string;
  maxStudents: number;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendance {
  id: string;
  classId: string;
  studentId: string;
  date: Date;
  status: 'present' | 'absent' | 'late';
  createdAt: Date;
  updatedAt: Date;
}

export interface Grade {
  id: string;
  classId: string;
  studentId: string;
  grade: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  classId: string;
  studentId: string;
  professorId: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const CLASSES_KEY = config.storage.classes;

// Dados de exemplo para classes
export const sampleClasses = [
  // Segunda-feira
  {
    id: '1',
    name: 'Residência em Clínica Médica',
    description: 'R1 - Clínica Médica',
    professorId: '1',
    professorName: 'Dr. Silva',
    schedule: 'Segunda-feira, 8:00',
    day: 1,
    time: '8:00',
    color: '#4285F4'
  },
  {
    id: '2',
    name: 'Plantão Clínico',
    description: 'Plantão Clínico',
    professorId: '1',
    professorName: 'Dr. Silva',
    schedule: 'Segunda-feira, 19:00',
    day: 1,
    time: '19:00',
    color: '#FF0000'
  },

  // Terça-feira
  {
    id: '3',
    name: 'Residência em Pediatria',
    description: 'R1 - Pediatria',
    professorId: '2',
    professorName: 'Dra. Santos',
    schedule: 'Terça-feira, 8:00',
    day: 2,
    time: '8:00',
    color: '#0F9D58'
  },
  {
    id: '4',
    name: 'Plantão Pediátrico',
    description: 'Plantão Pediátrico',
    professorId: '2',
    professorName: 'Dra. Santos',
    schedule: 'Terça-feira, 19:00',
    day: 2,
    time: '19:00',
    color: '#FF0000'
  },

  // Quarta-feira
  {
    id: '5',
    name: 'Residência em Cirurgia Geral',
    description: 'R1 - Cirurgia Geral',
    professorId: '3',
    professorName: 'Dr. Oliveira',
    schedule: 'Quarta-feira, 8:00',
    day: 3,
    time: '8:00',
    color: '#DB4437'
  },
  {
    id: '6',
    name: 'Plantão Cirúrgico',
    description: 'Plantão Cirúrgico',
    professorId: '3',
    professorName: 'Dr. Oliveira',
    schedule: 'Quarta-feira, 19:00',
    day: 3,
    time: '19:00',
    color: '#FF0000'
  },

  // Quinta-feira
  {
    id: '7',
    name: 'Residência em Ginecologia e Obstetrícia',
    description: 'R1 - GO',
    professorId: '4',
    professorName: 'Dra. Costa',
    schedule: 'Quinta-feira, 8:00',
    day: 4,
    time: '8:00',
    color: '#F4B400'
  },
  {
    id: '8',
    name: 'Plantão Obstétrico',
    description: 'Plantão Obstétrico',
    professorId: '4',
    professorName: 'Dra. Costa',
    schedule: 'Quinta-feira, 19:00',
    day: 4,
    time: '19:00',
    color: '#FF0000'
  },

  // Sexta-feira
  {
    id: '9',
    name: 'Residência em Psiquiatria',
    description: 'R1 - Psiquiatria',
    professorId: '5',
    professorName: 'Dr. Lima',
    schedule: 'Sexta-feira, 8:00',
    day: 5,
    time: '8:00',
    color: '#673AB7'
  },
  {
    id: '10',
    name: 'Plantão Psiquiátrico',
    description: 'Plantão Psiquiátrico',
    professorId: '5',
    professorName: 'Dr. Lima',
    schedule: 'Sexta-feira, 19:00',
    day: 5,
    time: '19:00',
    color: '#FF0000'
  },

  // Sábado
  {
    id: '11',
    name: 'Plantão Geral',
    description: 'Plantão Geral',
    professorId: '1',
    professorName: 'Dr. Silva',
    schedule: 'Sábado, 8:00',
    day: 6,
    time: '8:00',
    color: '#FF0000'
  },
  {
    id: '12',
    name: 'Plantão Noturno',
    description: 'Plantão Noturno',
    professorId: '2',
    professorName: 'Dra. Santos',
    schedule: 'Sábado, 19:00',
    day: 6,
    time: '19:00',
    color: '#FF0000'
  },

  // R2 - Segunda-feira
  {
    id: '13',
    name: 'Residência em Clínica Médica',
    description: 'R2 - Clínica Médica',
    professorId: '1',
    professorName: 'Dr. Silva',
    schedule: 'Segunda-feira, 14:00',
    day: 1,
    time: '14:00',
    color: '#4285F4'
  },

  // R2 - Terça-feira
  {
    id: '14',
    name: 'Residência em Pediatria',
    description: 'R2 - Pediatria',
    professorId: '2',
    professorName: 'Dra. Santos',
    schedule: 'Terça-feira, 14:00',
    day: 2,
    time: '14:00',
    color: '#0F9D58'
  },

  // R2 - Quarta-feira
  {
    id: '15',
    name: 'Residência em Cirurgia Geral',
    description: 'R2 - Cirurgia Geral',
    professorId: '3',
    professorName: 'Dr. Oliveira',
    schedule: 'Quarta-feira, 14:00',
    day: 3,
    time: '14:00',
    color: '#DB4437'
  },

  // R2 - Quinta-feira
  {
    id: '16',
    name: 'Residência em Ginecologia e Obstetrícia',
    description: 'R2 - GO',
    professorId: '4',
    professorName: 'Dra. Costa',
    schedule: 'Quinta-feira, 14:00',
    day: 4,
    time: '14:00',
    color: '#F4B400'
  },

  // R2 - Sexta-feira
  {
    id: '17',
    name: 'Residência em Psiquiatria',
    description: 'R2 - Psiquiatria',
    professorId: '5',
    professorName: 'Dr. Lima',
    schedule: 'Sexta-feira, 14:00',
    day: 5,
    time: '14:00',
    color: '#673AB7'
  }
];

export const initializeMockUsers = async (): Promise<User[]> => {
  try {
    console.log('Iniciando configuração dos usuários fixos...');

    // Salvar usuários fixos no AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(FIXED_USERS));
    console.log('Usuários fixos salvos no AsyncStorage');

    // Verificar se os usuários foram salvos corretamente
    const savedUsersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    console.log('Dados salvos no AsyncStorage:', savedUsersJson);

    if (!savedUsersJson) {
      throw new Error('Falha ao salvar usuários no AsyncStorage');
    }

    const savedUsers = JSON.parse(savedUsersJson);
    console.log('Usuários recuperados do AsyncStorage:', JSON.stringify(savedUsers, null, 2));

    return savedUsers;
  } catch (error) {
    console.error('Erro ao configurar usuários fixos:', error);
    throw error;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
    if (!usersJson) {
      // Se não houver usuários, inicializa com os usuários fixos
      return await initializeMockUsers();
    }
    return JSON.parse(usersJson);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    // Em caso de erro, retorna os usuários fixos
    return FIXED_USERS;
  }
};

export const saveUser = async (user: User): Promise<void> => {
  try {
    const users = await getUsers();
    const existingUserIndex = users.findIndex(u => u.id === user.id);

    if (existingUserIndex >= 0) {
      users[existingUserIndex] = user;
    } else {
      users.push(user);
    }

    await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    throw error;
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const users = await getUsers();
  return users.find(user => user.email === email) || null;
};

export const updateUser = async (id: string, data: Partial<User>): Promise<User | null> => {
  const users = await getUsers();
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...data,
    updatedAt: new Date()
  };

  await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  return users[index];
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const users = await getUsers();
  const filteredUsers = users.filter(user => user.id !== id);
  await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filteredUsers));
  return true;
};

// Funções para Turmas
export async function saveClass(classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>): Promise<Class> {
  try {
    const classes = await getClasses();
    const newClass: Class = {
      ...classData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    classes.push(newClass);
    await AsyncStorage.setItem(CLASSES_KEY, JSON.stringify(classes));
    return newClass;
  } catch (error) {
    console.error('Erro ao salvar turma:', error);
    throw error;
  }
}

export const getClasses = async () => {
  try {
    return sampleClasses;
  } catch (error) {
    console.error('Erro ao buscar turmas:', error);
    throw error;
  }
};

export async function getClassById(id: string): Promise<Class | null> {
  try {
    const classes = await getClasses();
    return classes.find(c => c.id === id) || null;
  } catch (error) {
    console.error('Erro ao buscar turma:', error);
    return null;
  }
}

export const getClassesByProfessor = async (professorId: string) => {
  try {
    return sampleClasses.filter(c => c.professorId === professorId);
  } catch (error) {
    console.error('Erro ao buscar turmas do professor:', error);
    throw error;
  }
};

export async function updateClass(id: string, classData: Partial<Class>): Promise<Class | null> {
  try {
    const classes = await getClasses();
    const index = classes.findIndex(c => c.id === id);
    if (index === -1) return null;

    classes[index] = {
      ...classes[index],
      ...classData,
      updatedAt: new Date().toISOString()
    };

    await AsyncStorage.setItem(CLASSES_KEY, JSON.stringify(classes));
    return classes[index];
  } catch (error) {
    console.error('Erro ao atualizar turma:', error);
    return null;
  }
}

export async function deleteClass(id: string): Promise<boolean> {
  try {
    const classes = await getClasses();
    const filteredClasses = classes.filter(c => c.id !== id);
    await AsyncStorage.setItem(CLASSES_KEY, JSON.stringify(filteredClasses));
    return true;
  } catch (error) {
    console.error('Erro ao deletar turma:', error);
    return false;
  }
}

// Funções para Matrículas
export const saveEnrollment = async (enrollment: Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Enrollment | null> => {
  try {
    const enrollments = await getItem<Enrollment>(config.storage.enrollments);
    const newEnrollment: Enrollment = {
      ...enrollment,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    enrollments.push(newEnrollment);
    await setItem(config.storage.enrollments, enrollments);
    return newEnrollment;
  } catch (error) {
    console.error('Erro ao salvar matrícula:', error);
    return null;
  }
};

export const getEnrollments = async (): Promise<Enrollment[]> => {
  return getItem<Enrollment>(config.storage.enrollments);
};

export const getEnrollmentsByStudent = async (studentId: string): Promise<Enrollment[]> => {
  const enrollments = await getItem<Enrollment>(config.storage.enrollments);
  return enrollments.filter(e => e.studentId === studentId);
};

export const getEnrollmentsByClass = async (classId: string): Promise<Enrollment[]> => {
  const enrollments = await getItem<Enrollment>(config.storage.enrollments);
  return enrollments.filter(e => e.classId === classId);
};

export const updateEnrollment = async (id: string, data: Partial<Enrollment>): Promise<Enrollment | null> => {
  const enrollments = await getItem<Enrollment>(config.storage.enrollments);
  const index = enrollments.findIndex(e => e.id === id);
  if (index === -1) return null;

  enrollments[index] = {
    ...enrollments[index],
    ...data,
    updatedAt: new Date()
  };

  await setItem(config.storage.enrollments, enrollments);
  return enrollments[index];
};

export const deleteEnrollment = async (id: string): Promise<boolean> => {
  const enrollments = await getItem<Enrollment>(config.storage.enrollments);
  const filteredEnrollments = enrollments.filter(e => e.id !== id);
  return setItem(config.storage.enrollments, filteredEnrollments);
};

// Funções para Presenças
export const saveAttendance = async (attendance: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>): Promise<Attendance | null> => {
  try {
    const attendances = await getItem<Attendance>(config.storage.attendances);
    const newAttendance: Attendance = {
      ...attendance,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    attendances.push(newAttendance);
    await setItem(config.storage.attendances, attendances);
    return newAttendance;
  } catch (error) {
    console.error('Erro ao salvar presença:', error);
    return null;
  }
};

export const getAttendances = async (): Promise<Attendance[]> => {
  return getItem<Attendance>(config.storage.attendances);
};

export const getAttendancesByClass = async (classId: string): Promise<Attendance[]> => {
  const attendances = await getItem<Attendance>(config.storage.attendances);
  return attendances.filter(a => a.classId === classId);
};

export const getAttendancesByStudent = async (studentId: string): Promise<Attendance[]> => {
  const attendances = await getItem<Attendance>(config.storage.attendances);
  return attendances.filter(a => a.studentId === studentId);
};

export const updateAttendance = async (id: string, data: Partial<Attendance>): Promise<Attendance | null> => {
  const attendances = await getItem<Attendance>(config.storage.attendances);
  const index = attendances.findIndex(a => a.id === id);
  if (index === -1) return null;

  attendances[index] = {
    ...attendances[index],
    ...data,
    updatedAt: new Date()
  };

  await setItem(config.storage.attendances, attendances);
  return attendances[index];
};

export const deleteAttendance = async (id: string): Promise<boolean> => {
  const attendances = await getItem<Attendance>(config.storage.attendances);
  const filteredAttendances = attendances.filter(a => a.id !== id);
  return setItem(config.storage.attendances, filteredAttendances);
};

// Funções para Notas
export const saveGrade = async (grade: Omit<Grade, 'id' | 'createdAt' | 'updatedAt'>): Promise<Grade | null> => {
  try {
    const grades = await getItem<Grade>(config.storage.grades);
    const newGrade: Grade = {
      ...grade,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    grades.push(newGrade);
    await setItem(config.storage.grades, grades);
    return newGrade;
  } catch (error) {
    console.error('Erro ao salvar nota:', error);
    return null;
  }
};

export const getGrades = async (): Promise<Grade[]> => {
  return getItem<Grade>(config.storage.grades);
};

export const getGradesByClass = async (classId: string): Promise<Grade[]> => {
  const grades = await getItem<Grade>(config.storage.grades);
  return grades.filter(g => g.classId === classId);
};

export const getGradesByStudent = async (studentId: string): Promise<Grade[]> => {
  const grades = await getItem<Grade>(config.storage.grades);
  return grades.filter(g => g.studentId === studentId);
};

export const updateGrade = async (id: string, data: Partial<Grade>): Promise<Grade | null> => {
  const grades = await getItem<Grade>(config.storage.grades);
  const index = grades.findIndex(g => g.id === id);
  if (index === -1) return null;

  grades[index] = {
    ...grades[index],
    ...data,
    updatedAt: new Date()
  };

  await setItem(config.storage.grades, grades);
  return grades[index];
};

export const deleteGrade = async (id: string): Promise<boolean> => {
  const grades = await getItem<Grade>(config.storage.grades);
  const filteredGrades = grades.filter(g => g.id !== id);
  return setItem(config.storage.grades, filteredGrades);
};

// Funções para Comentários
export const saveComment = async (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment | null> => {
  try {
    const comments = await getItem<Comment>(config.storage.comments);
    const newComment: Comment = {
      ...comment,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    comments.push(newComment);
    await setItem(config.storage.comments, comments);
    return newComment;
  } catch (error) {
    console.error('Erro ao salvar comentário:', error);
    return null;
  }
};

export const getComments = async (): Promise<Comment[]> => {
  return getItem<Comment>(config.storage.comments);
};

export const getCommentsByClass = async (classId: string): Promise<Comment[]> => {
  const comments = await getItem<Comment>(config.storage.comments);
  return comments.filter(c => c.classId === classId);
};

export const getCommentsByStudent = async (studentId: string): Promise<Comment[]> => {
  const comments = await getItem<Comment>(config.storage.comments);
  return comments.filter(c => c.studentId === studentId);
};

export const updateComment = async (id: string, data: Partial<Comment>): Promise<Comment | null> => {
  const comments = await getItem<Comment>(config.storage.comments);
  const index = comments.findIndex(c => c.id === id);
  if (index === -1) return null;

  comments[index] = {
    ...comments[index],
    ...data,
    updatedAt: new Date()
  };

  await setItem(config.storage.comments, comments);
  return comments[index];
};

export const deleteComment = async (id: string): Promise<boolean> => {
  const comments = await getItem<Comment>(config.storage.comments);
  const filteredComments = comments.filter(c => c.id !== id);
  return setItem(config.storage.comments, filteredComments);
};

// Função para obter o estado de autenticação
export const getAuthState = async () => {
  try {
    const session = await AsyncStorage.getItem(STORAGE_KEYS.SESSION);
    if (session) {
      const userData = JSON.parse(session);
      return {
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.type
        },
        isAuthenticated: true
      };
    }
    return null;
  } catch (error) {
    console.error('Erro ao obter estado de autenticação:', error);
    return null;
  }
};

// Função para salvar o estado de autenticação
export const saveAuthState = async (user: User) => {
  try {
    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type
    };
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
    return true;
  } catch (error) {
    console.error('Erro ao salvar estado de autenticação:', error);
    return false;
  }
};

// Função para limpar o estado de autenticação
export const clearAuthState = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION);
    return true;
  } catch (error) {
    console.error('Erro ao limpar estado de autenticação:', error);
    return false;
  }
}; 