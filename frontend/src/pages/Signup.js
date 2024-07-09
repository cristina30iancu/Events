// src/components/Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css'; // Asigură-te că stilurile sunt importate

export const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/auth/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      console.log('Signup successful:', response.data);
    } catch (err) {
      setError('Error signing up');
    }
  };

  return (
    <div className="container-fluid signup-container">
      <div className="row">
        <div className="col-md-6 signup-image-container">
        <img src="https://images.unsplash.com/photo-1612042912938-178455303812?fm=jpg&w=3000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHVycGxlJTIwbGlxdWlkfGVufDB8fDB8fHww" alt="Signup" className="img-fluid login-image" />
         </div>
        <div className="col-md-6 signup-form-container d-flex align-items-center justify-content-center">
          <div className="signup-box">
            <h2>Creează un cont!</h2>
            <form onSubmit={handleSignup}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Nume complet"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Telefon"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Parolă"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Confirmă parola"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="signup-button">Creează cont</button>
            </form>
            <div className="links">
              <p>Ai deja un cont? <a href="/login">Intră în cont</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;