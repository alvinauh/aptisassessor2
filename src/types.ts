export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface Assessment {
  id: string;
  userId: string;
  type: 'speaking' | 'listening' | 'reading' | 'writing';
  content: string;
  cefrLevel: string;
  createdAt: string;
}

export interface AudioSubmission {
  id: string;
  userId: string;
  r2Key: string;
  transcript?: string;
  assessmentId?: string;
  createdAt: string;
}

export interface ProgressData {
  skill: string;
  level: string;
  date: string;
  improvement: number;
}