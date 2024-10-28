import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User } from '../types';

interface LoginProps {
  setUser: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/login', { email, password });
      const { token, userId, username, isAdmin } = response.data;
      localStorage.setItem('token', token);
      const user: User = { id: userId, username, email, isAdmin };
      setUser(user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid credentials');
    }
  };

  // ... rest of the component remains the same
}

export default Login;