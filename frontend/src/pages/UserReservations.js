import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import './UserReservations.css'; // Stilurile pentru componentă
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaStar } from 'react-icons/fa';

const UserReservations = () => {
    const { state } = useAuth();
    const { id } = useParams();
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [feedback, setFeedback] = useState({ title: '', description: '', rating: 0 });
    const [viewFeedback, setViewFeedback] = useState(false); // Pentru a decide dacă arătăm feedback-ul existent sau formularul
    const [newStatus, setNewStatus] = useState('');
    
    const fetchReservations = async () => {
        try {
            const userId = id || state.id;
            const response = await axios.get(`http://localhost:8080/reservations/user/${userId}`);
            setReservations(response.data);
            setFilteredReservations(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, [id, state.id]);

    useEffect(() => {
        if (filterStatus) {
            setFilteredReservations(reservations.filter(reservation => reservation.status === filterStatus));
        } else {
            setFilteredReservations(reservations);
        }
    }, [filterStatus, reservations]);

    const handleShowModal = (reservation) => {
        setSelectedReservation(reservation);
        setShowModal(true);
    };

    const handleShowFeedbackModal = (reservation, view = false) => {
        setSelectedReservation(reservation);
        setViewFeedback(view);
        if (view && reservation.Feedback) {
            setFeedback({
                title: reservation.Feedback.title,
                description: reservation.Feedback.description,
                rating: reservation.Feedback.rating,
            });
        }
        setShowFeedbackModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedReservation(null);
        setNewStatus('');
    };

    const handleCloseFeedbackModal = () => {
        setShowFeedbackModal(false);
        setSelectedReservation(null);
        setFeedback({ title: '', description: '', rating: 0 });
        setViewFeedback(false);
    };

    const handleStatusChange = (e) => {
        setNewStatus(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const handleStatusUpdate = async () => {
        if (!selectedReservation) return;

        try {
           const res = await axios.put(`http://localhost:8080/reservations/${selectedReservation.id}`, { status: newStatus });
            setReservations(reservations.map(res => res.id === selectedReservation.id ? { ...res, status: newStatus } : res));
            toast.success("Modificat!");
            handleCloseModal();
        } catch (error) {
            toast.error("Nu s-a putut modifica rezervarea!");
            console.error('Error updating reservation status:', error);
        }
    };

    const handleFeedbackChange = (e) => {
        const { name, value } = e.target;
        setFeedback({ ...feedback, [name]: value });
    };

    const handleRatingChange = (rating) => {
        setFeedback({ ...feedback, rating });
    };

    const handleFeedbackSubmit = async () => {
        try {
            const res = await axios.post('http://localhost:8080/feedback', {
                userId: state.id,
                hallId: selectedReservation.hallId,
                title: feedback.title,
                description: feedback.description,
                rating: feedback.rating,
                reservationId: selectedReservation.id,
            });
            if(res.status === 201){
                toast.success("Feedback adăugat!");
                await fetchReservations();
            } else {
                const data = await res.data;
                toast.error(data.message);
            }
            handleCloseFeedbackModal();
        } catch (error) {
            toast.error("Nu s-a putut adăuga feedback-ul!");
            console.error('Error adding feedback:', error);
        }
    };

    const generateInvoice = (reservation) => {
        const doc = new jsPDF();
        const tableColumn = ["Serviciu", "Pret", "Subtotal"];
        const tableRows = [];

        reservation.Services.forEach(service => {
            const price = service.perPerson ? service.price * reservation.numberOfPeople : service.price;
            const rowData = [
                service.name,
                `${service.price} lei`,
                `${price} lei`
            ];
            tableRows.push(rowData);
        });

        const totalAmount = reservation.Services.reduce((total, service) => {
            return total + (service.perPerson ? service.price * reservation.numberOfPeople : service.price);
        }, 0);

        doc.text("Factura", 14, 15);
        doc.text(`Nume eveniment: ${reservation.eventName}`, 14, 25);
        doc.text(`Data: ${new Date(reservation.eventDate).toLocaleDateString()}`, 14, 35);
        doc.text(`Numar persoane: ${reservation.numberOfPeople}`, 14, 45);
        doc.text(`Salon: ${reservation.Hall.name}`, 14, 55);
        doc.text(`Restaurant: ${reservation.Hall.Restaurant.name}`, 14, 65);
        doc.text(`Client: ${reservation.User.name}`, 14, 75);

        doc.autoTable(tableColumn, tableRows, { startY: 85 });
        doc.text(`Total: ${totalAmount} lei`, 14, doc.autoTable.previous.finalY + 10);

        doc.save(`Factura_${reservation.eventName}.pdf`);
    };

    return (
        <Container className="user-reservations-container">
            <h2>{id ? "Rezervările clientului" : "Rezervările mele"}</h2>
            <Card className='p-3 col-3 mb-3'>
            <Form.Group controlId="filterStatus" className="mb-4">
                <Form.Label>Filtrează după status</Form.Label>
                <Form.Control as="select" value={filterStatus} onChange={handleFilterChange}>
                    <option value="">Toate</option>
                    <option value="în așteptare">În așteptare</option>
                    <option value="confirmată">Confirmată</option>
                    <option value="anulată">Anulată</option>
                </Form.Control>
            </Form.Group>
            </Card>
            <Row>
                {filteredReservations.map((reservation) => (
                    <Col md={6} key={reservation.id} className="mb-4">
                        <Card className="reservation-card shadow-sm">
                            <Card.Body>
                                <Card.Title>{reservation.eventName}</Card.Title>
                                <Card.Text><strong>Data:</strong> {new Date(reservation.eventDate).toLocaleDateString()}</Card.Text>
                                <Card.Text><strong>Număr persoane:</strong> {reservation.numberOfPeople}</Card.Text>
                                <Card.Text><strong>Salon:</strong> {reservation.Hall.name}</Card.Text>
                                <Card.Text><strong>Servicii:</strong> {reservation.Services.map(service => service.name).join(', ')}</Card.Text>
                                <Card.Text><strong>Status:</strong> {reservation.status}</Card.Text>
                                {reservation.status === 'confirmată' && !state.isAdmin && !reservation.Feedback && (
                                    <Button variant="success" onClick={() => handleShowFeedbackModal(reservation, false)} className="m-2">
                                        Adaugă feedback
                                    </Button>
                                )}
                                {reservation.status === 'confirmată' && reservation.Feedback && (
                                    <Button variant="info" onClick={() => handleShowFeedbackModal(reservation, true)} className="m-2">
                                        Vezi feedback
                                    </Button>
                                )}
                                {state.isAdmin && (
                                    <Button variant="primary" className="m-2" onClick={() => handleShowModal(reservation)}>
                                        Modifică status
                                    </Button>
                                )}
                                <Button variant="secondary" onClick={() => generateInvoice(reservation)} className="m-2">
                                    Generează factură
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Modificare rezervare</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Control as="select" value={newStatus} onChange={handleStatusChange}>
                            <option value="">Selectează operația</option>
                            <option value="confirmată">Confirmă</option>
                            <option value="anulată">Anulează</option>
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Anulează
                    </Button>
                    <Button variant="primary" onClick={handleStatusUpdate}>
                        Salvează
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showFeedbackModal} onHide={handleCloseFeedbackModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{viewFeedback ? "Feedback" : "Adaugă feedback"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {viewFeedback ? (
                        <>
                            <h5>{feedback.title}</h5>
                            <p>{feedback.description}</p>
                            <div>
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        size={30}
                                        color={i < feedback.rating ? '#ffc107' : '#e4e5e9'}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <Form.Group controlId="formTitle">
                                <Form.Label>Titlu</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={feedback.title}
                                    onChange={handleFeedbackChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formDescription">
                                <Form.Label>Descriere</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={feedback.description}
                                    onChange={handleFeedbackChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formRating">
                                <Form.Label>Notă</Form.Label>
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        size={30}
                                        color={i < feedback.rating ? '#ffc107' : '#e4e5e9'}
                                        onClick={() => handleRatingChange(i + 1)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ))}
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseFeedbackModal}>
                        Anulează
                    </Button>
                    {!viewFeedback && (
                        <Button variant="primary" onClick={handleFeedbackSubmit}>
                            Trimite feedback
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserReservations;
