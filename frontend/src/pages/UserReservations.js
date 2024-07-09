import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import './UserReservations.css'; // Stilurile pentru componentă
import { useAuth } from '../context/AuthContext';

const UserReservations = () => {
    const { state, dispatch } = useAuth();
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/reservations/user/${state.id}`);
                setReservations(response.data);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };

        fetchReservations();
    }, [state.id]);

    return (
        <Container className="user-reservations-container">
            <h2>Rezervările Utilizatorului</h2>
            <Row>
                {reservations.map((reservation) => (
                    <Col md={6} key={reservation.id} className="mb-4">
                        <Card className="reservation-card shadow-sm">
                            <Card.Body>
                                <Card.Title>{reservation.eventName}</Card.Title>
                                <Card.Text><strong>Data:</strong> {new Date(reservation.eventDate).toLocaleDateString()}</Card.Text>
                                <Card.Text><strong>Număr persoane:</strong> {reservation.numberOfPeople}</Card.Text>
                                <Card.Text><strong>Salon:</strong> {reservation.Hall.name}</Card.Text>
                                <Card.Text><strong>Servicii:</strong> {reservation.Services.map(service => service.name).join(', ')}</Card.Text>
                                <Card.Text><strong>Status:</strong> {reservation.status}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default UserReservations;
