const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8787/api';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

export const api = {
  auth: {
    login: (credentials: { email: string; password: string }) =>
      fetchWithAuth('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    register: (userData: { username: string; email: string; password: string }) =>
      fetchWithAuth('/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
  },
  assessment: {
    submit: async (data: { type: string; content: string }) => {
      const response = await fetchWithAuth('/assessment', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.assessment;
    },
    getProgress: (userId: string) =>
      fetchWithAuth(`/progress/${userId}`),
  },
  audio: {
    upload: async (file: Blob) => {
      const formData = new FormData();
      formData.append('audio', file);
      return fetchWithAuth('/audio', {
        method: 'POST',
        body: formData,
        headers: {}, // Let browser set content-type for FormData
      });
    },
  },
};