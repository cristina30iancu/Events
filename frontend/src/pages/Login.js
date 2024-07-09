// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Asigură-te că stilurile sunt importate
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { state, dispatch } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/auth/login', { email, password });
      console.log('Login successful:', response.data);
      const data = response.data
      navigate("/");
      localStorage.setItem('token', data.token);
      const decoded = jwtDecode(data.token);
      dispatch({ type: 'SET_ADMIN', payload: decoded.isAdmin });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="container-fluid login-container">
      <div className="row">
        <div className="col-md-6 login-image-container">
          <img src="https://images.unsplash.com/photo-1612042912938-178455303812?fm=jpg&w=3000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHVycGxlJTIwbGlxdWlkfGVufDB8fDB8fHww" alt="Login" className="img-fluid login-image" />
        </div>
        <div className="col-md-6 login-form-container d-flex align-items-center justify-content-center">
          <div className="login-box">
            <h2>Bine ai revenit!</h2>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Parolă"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="login-button">Intră în cont</button>
            </form>
            <div className="links">
              <p>Nu ai cont? <a href="/register">Creează-ți unul!</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;