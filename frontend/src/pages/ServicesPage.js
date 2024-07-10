import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, Row, Col, Card, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import './ServicesPage.css'; // Stilurile pentru componentă

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '', perPerson: ''
  });
  const [selectedService, setSelectedService] = useState(null);
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

  const handleShowModal = (service = null) => {
    setSelectedService(service);
    if (service) {
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price,
        perPerson: service.perPerson
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '', perPerson: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  const handleShowDeleteModal = (service) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedService(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddOrUpdateService = async (e) => {
    e.preventDefault();
    try {
      if (selectedService) {
        await axios.put(`http://localhost:8080/services/${selectedService.id}`, formData);
        setServices(services.map(service => (service.id === selectedService.id ? { ...service, ...formData } : service)));
      } else {
        const response = await axios.post('http://localhost:8080/services', formData);
        setServices([...services, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      setError('Error saving service');
    }
  };

  const handleDeleteService = async () => {
    try {
      await axios.delete(`http://localhost:8080/services/${selectedService.id}`);
      setServices(services.filter(service => service.id !== selectedService.id));
      handleCloseDeleteModal();
    } catch (error) {
      setError('Error deleting service');
    }
  };

  return (
    <Container className="services-page-container">
      <div className="add-button-container">
        <Button variant="primary" onClick={() => handleShowModal()} className="add-service-button">
          Adaugă
        </Button>
      </div>
      <Row>
        {services.map((service) => (
          <Col md={4} key={service.id} className="mb-4">
            <Card className="service-card shadow-sm">
              <Card.Body>
                <Card.Title>{service.name}</Card.Title>
                <Card.Text>{service.description}</Card.Text>
                <Card.Text><strong>Preț:</strong> {service.price} RON</Card.Text>
                <Button variant="outline-primary" className="me-2" onClick={() => handleShowModal(service)}>
                  <FaEdit /> 
                </Button>
                <Button variant="outline-danger" onClick={() => handleShowDeleteModal(service)}>
                  <FaTrashAlt /> 
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedService ? 'Editare Serviciu' : 'Adaugă Serviciu'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddOrUpdateService}>
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
                checked={formData.perPerson}
                onChange={handleChange}
              />
            </Form.Group>

            {error && <p className="error-message">{error}</p>}
            
            <Button variant="primary" type="submit" className="add-button">
              {selectedService ? 'Editare Serviciu' : 'Adaugă Serviciu'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmare Ștergere</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Ești sigur că dorești să ștergi serviciul {selectedService?.name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Anulează
          </Button>
          <Button variant="danger" onClick={handleDeleteService}>
            Șterge
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ServicesPage;
