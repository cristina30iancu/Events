// src/components/AddHall.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';
import './AddHall.css'; // Stilurile pentru formular
import { toast } from 'react-toastify';

const AddHall = () => {
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    facilities: '',
    image: '',
    restaurantId: ''
  });
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:8080/restaurants');
        setRestaurants(response.data);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      }
    };
    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddHall = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/halls', formData);
      toast.success("Salon adăugat!");
      setError('')
      console.log('Hall added successfully:', response.data);
      // Redirecționează sau efectuează alte acțiuni necesare după adăugare
    } catch (err) {
      setError('Error adding hall');
    }
  };

  return (
    <Container className="add-hall-container">
      <h2>Adaugă Salon</h2>
      <Form onSubmit={handleAddHall}>
        <Form.Group controlId="formName">
          <Form.Label>Nume</Form.Label>
          <Form.Control
            type="text"
            placeholder="Introdu numele salonului"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formCapacity">
          <Form.Label>Capacitate</Form.Label>
          <Form.Control
            type="number"
            placeholder="Introdu capacitatea salonului"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formFacilities">
          <Form.Label>Facilități</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Introdu facilitățile salonului"
            name="facilities"
            value={formData.facilities}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formImage">
          <Form.Label>Imagine URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Introdu URL-ul imaginii salonului"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formRestaurantId">
          <Form.Label>Restaurant</Form.Label>
          <Form.Control
            as="select"
            name="restaurantId"
            value={formData.restaurantId}
            onChange={handleChange}
            required
          >
            <option value="">Selectează un restaurant</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {error && <p className="error-message">{error}</p>}
        
        <Button variant="primary" type="submit" className="add-button">
          Adaugă Salon
        </Button>
      </Form>
    </Container>
  );
};

export default AddHall;
