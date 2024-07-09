// src/components/Home.js
import React from 'react';
import { Carousel, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css'; // Asigură-te că stilurile sunt importate
import { FadeInSection } from '../components/FadeInSection';

const Home = () => {
    return (
        <div className="home-container">
            <Carousel>
                <Carousel.Item>
                    <img
                        className="d-block w-100 carousel-image"
                        src="https://images.pexels.com/photos/16935897/pexels-photo-16935897/free-photo-of-table-setting-and-decorations-in-a-restaurant.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        alt="First slide"
                    />
                    <Carousel.Caption>
                        <h3>Planifică-ți evenimentul perfect</h3>
                        <p>Cu aplicația noastră poți organiza evenimente memorabile.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100 carousel-image"
                        src="https://images.pexels.com/photos/16120256/pexels-photo-16120256/free-photo-of-wedding-cake-on-a-table-decorated-with-pink-flowers.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        alt="Second slide"
                    />
                    <Carousel.Caption>
                        <h3>Găsește locația ideală</h3>
                        <p>Explorează diverse locații de evenimente pentru ocazii speciale.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100 carousel-image"
                        src="https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/295924479/original/c5d65db40742f2fc6f088f28d5cfe4be80776f58/render-4k-realistic-3d-wedding-decoration-and-events-design.jpg"
                        alt="Third slide"
                    />
                    <Carousel.Caption>
                        <h3>Organizează conferințe de succes</h3>
                        <p>Rezervă săli de conferințe echipate cu toate facilitățile necesare.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

            <Container className="features-container">
                <FadeInSection>
                    <Row className="feature-row">
                        <Col md={4} className="feature-box fade-in">
                            <h4>Administrare simplă</h4>
                            <p>Gestionează-ți restaurantul și saloanele cu ușurință.</p>
                        </Col>
                        <Col md={4} className="feature-box fade-in">
                            <h4>Rezervări rapide</h4>
                            <p>Confirmă și gestionează rezervările clienților eficient.</p>
                        </Col>
                        <Col md={4} className="feature-box fade-in">
                            <h4>Servicii variate</h4>
                            <p>Oferă clienților diverse servicii personalizate pentru evenimente.</p>
                        </Col>
                    </Row>
                    <Row className="feature-row">
                        <Col md={4} className="feature-box fade-in">
                            <h4>Tablou de bord intuitiv</h4>
                            <p>Vizualizează statistici și grafice despre activitatea restaurantului.</p>
                        </Col>
                        <Col md={4} className="feature-box fade-in">
                            <h4>Generare facturi</h4>
                            <p>Generează și descarcă facturi PDF pentru fiecare rezervare confirmată.</p>
                        </Col>
                        <Col md={4} className="feature-box fade-in">
                            <h4>Înscriere și autentificare</h4>
                            <p>Utilizatorii se pot înregistra și autentifica pentru a accesa contul lor.</p>
                        </Col>
                    </Row>
                </FadeInSection>
            </Container>
        </div>
    );
};

export default Home;
