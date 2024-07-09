// src/components/RestaurantList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './RestaurantList.css';
import {Add, Visibility, VisibilityOutlined } from '@mui/icons-material';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:8080/restaurants');
        console.log(response.data)
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };
    fetchRestaurants();
  }, []);

  const handleAddRestaurant = () => {
    navigate('/add-restaurant');
  };

  const handleClick = (id) => {
    navigate(`/restaurant/${id}`);
  };

  return (
    <Container className="restaurant-list-container">
        <div className="add-button-container">
        <Button variant="primary" onClick={handleAddRestaurant} className="add-restaurant-button">
          Adaugă restaurant
        </Button>
      </div>
      <Row>
        {restaurants.map((restaurant) => (
          <Col md={4} key={restaurant.id} className="mb-4">
            <Card className="restaurant-card shadow-sm">
              <Card.Img variant="top" src={restaurant.image} alt={restaurant.name} />
              <Card.Body>
                <Card.Title><strong>Restaurantul</strong> {restaurant.name}</Card.Title>
                <Card.Text>{restaurant.description}</Card.Text>
                <Button className='btn btn-outlined' onClick={() => handleClick(restaurant.id)}>
                <VisibilityOutlined/>
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default RestaurantList;