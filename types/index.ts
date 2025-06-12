export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'professor';
}

export interface Class {
  id: string;
  name: string;
  description: string;
  professorId: string;
  professorName: string;
  schedule: {
    day: number;
    time: string;
    color: string;
  };
}

export interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  status: 'pending' | 'approved' | 'rejected';
  class: Class;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
} 