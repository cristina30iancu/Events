import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { VisibilityOutlined, Edit, Delete } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import './RestaurantList.css';

const RestaurantList = () => {
  const { state } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    address: '',
    description: '',
    image: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:8080/restaurants');
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

  const handleEditClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setEditFormData({
      name: restaurant.name,
      address: restaurant.address,
      description: restaurant.description,
      image: restaurant.image
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDeleteModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/restaurants/${selectedRestaurant.id}`, editFormData);
      setShowEditModal(false);
      const updatedRestaurants = restaurants.map(restaurant =>
        restaurant.id === selectedRestaurant.id ? { ...restaurant, ...editFormData } : restaurant
      );
      setRestaurants(updatedRestaurants);
    } catch (error) {
      console.error('Error updating restaurant:', error);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await axios.delete(`http://localhost:8080/restaurants/${selectedRestaurant.id}`);
      setShowDeleteModal(false);
      setRestaurants(restaurants.filter(restaurant => restaurant.id !== selectedRestaurant.id));
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
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
                  <VisibilityOutlined />
                </Button>
                {state.isAdmin && (
                  <>
                    <Button className='btn btn-outlined mx-2' onClick={() => handleEditClick(restaurant)}>
                      <Edit />
                    </Button>
                    <Button className='btn btn-outlined' onClick={() => handleDeleteClick(restaurant)}>
                      <Delete />
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editare Restaurant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Nume</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introdu numele"
                name="name"
                value={editFormData.name}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAddress">
              <Form.Label>Adresă</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introdu adresa"
                name="address"
                value={editFormData.address}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Descriere</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Introdu descrierea"
                name="description"
                value={editFormData.description}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Imagine URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introdu URL-ul imaginii"
                name="image"
                value={editFormData.image}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Salvează
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Șterge Restaurant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Doriți să ștergeți restaurantul {selectedRestaurant?.name}?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Anulează
          </Button>
          <Button variant="danger" onClick={handleDeleteSubmit}>
            Șterge
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RestaurantList;
