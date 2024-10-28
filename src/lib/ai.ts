import { api } from './api';

export async function assessCEFRLevel(
  text: string, 
  skill: 'reading' | 'writing' | 'speaking' | 'listening'
): Promise<string> {
  try {
    return await api.assessment.submit({
      type: skill,
      content: text,
    });
  } catch (error) {
    console.error('Error assessing CEFR level:', error);
    throw new Error('Assessment failed. Please try again.');
  }
}