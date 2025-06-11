import { Class, Enrollment, User } from '../services/storage';

export const initialUsers: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Professor Teste',
    email: 'professor@teste.com',
    password: '123456',
    type: 'professor',
  },
  {
    name: 'Aluno Teste',
    email: 'aluno@teste.com',
    password: '123456',
    type: 'aluno',
  },
];

export const initialClasses: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Turma A',
    description: 'Turma de teste A',
    professorId: '', // Será preenchido após criar o professor
    maxStudents: 30,
  },
  {
    name: 'Turma B',
    description: 'Turma de teste B',
    professorId: '', // Será preenchido após criar o professor
    maxStudents: 30,
  },
];

export const initialEnrollments: Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    studentId: '', // Será preenchido após criar o aluno
    classId: '', // Será preenchido após criar as turmas
    status: 'active',
  },
]; 