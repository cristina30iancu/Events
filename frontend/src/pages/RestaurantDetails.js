import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import './RestaurantDetails.css'; // Stilurile pentru componentă

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);
  const [reservationData, setReservationData] = useState({
    eventName: '',
    eventDate: '',
    numberOfPeople: '',
    serviceIds: [] // Array to hold multiple service IDs
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/restaurants/${id}`);
        setRestaurant(response.data);
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:8080/services');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchRestaurant();
    fetchServices();
  }, [id]);

  const handleShowModal = (hall) => {
    setSelectedHall(hall);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedHall(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservationData({
      ...reservationData,
      [name]: value
    });
  };

  const handleServiceChange = (e) => {
    const { options } = e.target;
    const value = [];
    for (const option of options) {
      if (option.selected) {
        value.push(option.value);
      }
    }
    setReservationData({
      ...reservationData,
      serviceIds: value
    });
  };

  const handleReservation = async (e) => {
    e.preventDefault();

    if (new Date(reservationData.eventDate) <= new Date()) {
      setError('Data trebuie să fie în viitor.');
      return;
    }

    if (reservationData.numberOfPeople > selectedHall.capacity) {
      setError('Numărul de persoane depășește capacitatea salonului.');
      return;
    }

    try {
      const userId = 1; // Înlocuiește cu ID-ul utilizatorului autentic

      // Verifică dacă utilizatorul are deja o rezervare în acea zi
      const userReservation = await axios.get(`http://localhost:8080/reservations/user/${userId}/date/${reservationData.eventDate}`);
      if (userReservation.data) {
        setError('Aveți deja o rezervare în acea zi.');
        return;
      }

      // Verifică dacă salonul este deja rezervat în acea zi
      const hallReservation = await axios.get(`http://localhost:8080/reservations/hall/${selectedHall.id}/date/${reservationData.eventDate}`);
      if (hallReservation.data) {
        setError('Salonul este deja rezervat în acea zi.');
        return;
      }

      const response = await axios.post('http://localhost:8080/reservations', {
        eventName: reservationData.eventName,
        eventDate: reservationData.eventDate,
        numberOfPeople: reservationData.numberOfPeople,
        hallId: selectedHall.id,
        serviceIds: reservationData.serviceIds,
        userId
      });
      console.log('Reservation successful:', response.data);
      handleCloseModal();
    } catch (error) {
      setError('Error making reservation');
    }
  };

  if (!restaurant) return <div>Loading...</div>;

  return (
    <Container className="restaurant-details-container">
      <Card className="restaurant-details-card shadow-sm">
        <Card.Img variant="top" src={restaurant.image} alt={restaurant.name} />
        <Card.Body>
          <Card.Title>{restaurant.name}</Card.Title>
          <Card.Text>{restaurant.description}</Card.Text>
          <Card.Text><strong>Adresă:</strong> {restaurant.address}</Card.Text>
        </Card.Body>
      </Card>
      <div className="add-button-container">
        <Button variant="primary" className="add-hall-button">
          Adauga salon
        </Button>
      </div>
      <h3 className="mt-5">Saloane</h3>
      <Row>
        {restaurant.Halls.map((hall) => (
          <Col md={6} key={hall.id} className="mb-4">
            <Card className="hall-card shadow-sm">
              <Card.Img variant="top" src={hall.image} alt={hall.name} />
              <Card.Body>
                <Card.Title>{hall.name}</Card.Title>
                <Card.Text><strong>Capacitate:</strong> {hall.capacity}</Card.Text>
                <Card.Text><strong>Facilități:</strong> {hall.facilities}</Card.Text>
                <Button variant="success" onClick={() => handleShowModal(hall)}>
                  Rezervă
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Rezervă Salon</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleReservation}>
            <Form.Group controlId="formEventName">
              <Form.Label>Nume Eveniment</Form.Label>
              <Form.Control
                type="text"
                name="eventName"
                value={reservationData.eventName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEventDate">
              <Form.Label>Data Evenimentului</Form.Label>
              <Form.Control
                type="date"
                name="eventDate"
                value={reservationData.eventDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]} // Setează valoarea minimă la data de astăzi
              />
            </Form.Group>

            <Form.Group controlId="formNumberOfPeople">
              <Form.Label>Număr de Persoane</Form.Label>
              <Form.Control
                type="number"
                name="numberOfPeople"
                value={reservationData.numberOfPeople}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formService">
              <Form.Label>Servicii</Form.Label>
              <Form.Control
                as="select"
                name="serviceIds"
                value={reservationData.serviceIds}
                onChange={handleServiceChange}
                required
                multiple
              >
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {error && <p className="error-message">{error}</p>}
            
            <Button variant="primary" type="submit" className="reserve-button">
              Rezervă
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default RestaurantDetails;
