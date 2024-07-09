// src/components/ServicesPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, Row, Col, Card, Modal, Form } from 'react-bootstrap';
import './ServicesPage.css'; // Stilurile pentru componentă

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '', perPerson: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:8080/services');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value // Actualizează valoarea în funcție de tipul de input
    });
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/services', formData);
      setServices([...services, formData]);
      handleCloseModal();
      setFormData({
        name: '',
        description: '',
        price: '', perPerson: ''
      })
    } catch (error) {
      setError('Error adding service');
    }
  };

  return (
    <Container className="services-page-container">
      <div className="add-button-container">
        <Button variant="primary" onClick={handleShowModal} className="add-service-button">
          Adaugă
        </Button>
      </div>
      <Row>
        {services.map((service, index) => (
          <Col md={4} key={index} className="mb-4">
            <Card className="service-card shadow-sm">
              <Card.Body>
                <Card.Title>{service.name}</Card.Title>
                <Card.Text>{service.description}</Card.Text>
                <Card.Text><strong>Preț:</strong> {service.price} RON</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Adaugă Serviciu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddService}>
            <Form.Group controlId="formName">
              <Form.Label>Nume</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introdu numele serviciului"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Descriere</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Introdu descrierea serviciului"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPrice">
              <Form.Label>Preț (RON)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Introdu prețul serviciului"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="perPerson">
              <Form.Label>Preț per persoană</Form.Label>
              <Form.Check
                type="checkbox"
                name="perPerson"
                value={formData.perPerson}
                onChange={handleChange} 
              />
            </Form.Group>


            {error && <p className="error-message">{error}</p>}
            
            <Button variant="primary" type="submit" className="add-button">
              Adaugă Serviciu
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ServicesPage;