export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  type: 'professor' | 'aluno';
  createdAt: string;
  updatedAt: string;
} 