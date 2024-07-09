import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col } from 'react-bootstrap';
import './RezervariList.css'; // Stilurile pentru componentă
import ReservationCalendar from '../components/ReservationCalendar';

const RezervariList = () => {
  const [groupedReservations, setGroupedReservations] = useState({});
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('http://localhost:8080/reservations');
        const sortedReservations = response.data.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
        const grouped = sortedReservations.reduce((acc, reservation) => {
          const hallName = reservation.Hall.name;
          if (!acc[hallName]) {
            acc[hallName] = [];
          }
          acc[hallName].push(reservation);
          return acc;
        }, {});
        setGroupedReservations(grouped);
        const eventArray = response.data.map(reservation => ({
          title: reservation.eventName,
          start: reservation.eventDate,
          end: reservation.eventDate,
          description: `Număr persoane: ${reservation.numberOfPeople}, Salon: ${reservation.Hall.name}`
        }));
        setEvents(eventArray);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <Container className="rezervari-list-container">
      {Object.keys(groupedReservations).length ? (
        Object.keys(groupedReservations).map((hallName) => (
          <div key={hallName}>
            <h3>{hallName}</h3>
            <Row>
              {groupedReservations[hallName].map((reservation) => (
                <Col md={4} key={reservation.id} className="mb-4">
                  <Card className="reservation-card shadow-sm">
                    <Card.Img variant="top" src={reservation.Hall.image} alt={reservation.Hall.name} />
                    <Card.Body>
                      <Card.Title>{reservation.eventName}</Card.Title>
                      <Card.Text><strong>Data:</strong> {new Date(reservation.eventDate).toLocaleDateString()}</Card.Text>
                      <Card.Text><strong>Număr persoane:</strong> {reservation.numberOfPeople}</Card.Text>
                      <Card.Text><strong>Salon:</strong> {reservation.Hall.name}</Card.Text>
                      <Card.Text><strong>Client:</strong> {reservation.User.name}</Card.Text>
                      <Card.Text><strong>Email:</strong> {reservation.User.email}</Card.Text>
                      <Card.Text><strong>Telefon:</strong> {reservation.User.phone}</Card.Text>
                      <Card.Text><strong>Servicii:</strong>
                        <ul>
                          {reservation.Services.map(service => (
                            <li key={service.id}>{service.name} - {service.price} RON</li>
                          ))}
                        </ul>
                      </Card.Text>
                      <Card.Text><strong>Status:</strong> {reservation.status}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <Card className='p-3'>
            <ReservationCalendar events={events} /></Card>
          </div>
        ))
      ) : (
        <Card className='p-5'>
          <h1>Nu aveți rezervări.</h1>
        </Card>
      )}
    </Container>
  );
};

export default RezervariList;
