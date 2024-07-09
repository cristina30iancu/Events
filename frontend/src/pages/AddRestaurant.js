// src/components/AddRestaurant.js
import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';
import './AddRestaurant.css'; // Stilurile pentru formular
import { toast } from 'react-toastify';

const AddRestaurant = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    image: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/restaurants', formData);
      toast.success("Restaurant adăugat!")
      console.log('Restaurant added successfully:', response.data);
      setError('');
    } catch (err) {
      setError('Error adding restaurant');
    }
  };

  return (
    <Container className="add-restaurant-container">
      <h2>Adaugă Restaurant</h2>
      <Form onSubmit={handleAddRestaurant}>
        <Form.Group controlId="formName">
          <Form.Label>Nume</Form.Label>
          <Form.Control
            type="text"
            placeholder="Introdu numele restaurantului"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formAddress">
          <Form.Label>Adresă</Form.Label>
          <Form.Control
            type="text"
            placeholder="Introdu adresa restaurantului"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formDescription">
          <Form.Label>Descriere</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Introdu descrierea restaurantului"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formImage">
          <Form.Label>Imagine URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Introdu URL-ul imaginii restaurantului"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {error && <p className="error-message">{error}</p>}
        
        <Button variant="primary" type="submit" className="add-button">
          Adaugă Restaurant
        </Button>
      </Form>
    </Container>
  );
};

export default AddRestaurant;
