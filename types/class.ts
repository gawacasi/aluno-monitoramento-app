import { User } from './user';

export interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Class {
  id: string;
  name: string;
  subject: string;
  description: string;
  professor: User;
  startDate: string;
  endDate: string;
  schedule: Schedule[];
  location: string;
  enrollments?: User[];
  createdAt: string;
  updatedAt: string;
} 