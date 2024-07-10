import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './AllFeedbacks.css'; // Stilurile pentru componentă
import { FaStar } from 'react-icons/fa';

const AllFeedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [groupedFeedbacks, setGroupedFeedbacks] = useState({});

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get('http://localhost:8080/feedback');
                const feedbackData = response.data;
                console.log(feedbackData)
                // Gruparea feedbackurilor după saloane
                const grouped = feedbackData.reduce((acc, feedback) => {
                    const hallName = feedback.Hall.name;
                    if (!acc[hallName]) {
                        acc[hallName] = [];
                    }
                    acc[hallName].push(feedback);
                    return acc;
                }, {});
                setFeedbacks(feedbackData);
                setGroupedFeedbacks(grouped);
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
            }
        };

        fetchFeedbacks();
    }, []);

    return (
        <Container className="all-feedbacks-container">
            <h2>Toate recenziile</h2>
            {Object.keys(groupedFeedbacks).map((hallName) => (
                <div key={hallName}>
                    <h3>{hallName}</h3>
                    <Row>
                        {groupedFeedbacks[hallName].map((feedback) => (
                            <Col md={6} key={feedback.id} className="mb-4">
                                <Card className="feedback-card shadow-sm">
                                    <Card.Body>
                                        <Card.Title>{feedback.title}</Card.Title>
                                        <Card.Text>{feedback.description}</Card.Text>
                                        <div>
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    size={20}
                                                    color={i < feedback.rating ? '#ffc107' : '#e4e5e9'}
                                                />
                                            ))}
                                        </div>
                                        <Card.Text><strong>Client:</strong> {feedback.User.name}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            ))}
        </Container>
    );
};

export default AllFeedbacks;