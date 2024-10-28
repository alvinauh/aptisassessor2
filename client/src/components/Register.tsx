import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/api/register', { username, email, password });
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError('Error registering user');
    }
  };

  // ... rest of the component remains the same
}

export default Register;