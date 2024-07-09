import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './AdminUsersList.css'; // Stilurile pentru componentă

const AdminUsersList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/users');
        const nonAdminUsers = response.data.filter(user => user.role !== 'admin');
        setUsers(nonAdminUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}/reservations`);
  };

  return (
    <Container className="admin-users-list-container">
      <h2>Clienți</h2>
      <Row>
        {users.map((user) => (
          <Col md={4} key={user.id} className="mb-4">
            <Card className="user-card shadow-sm" onClick={() => handleUserClick(user.id)}>
              <Card.Body>
                <Card.Title>{user.name}</Card.Title>
                <Card.Text><strong>Email:</strong> {user.email}</Card.Text>
                <Card.Text><strong>Telefon:</strong> {user.phone}</Card.Text>
                <Card.Text><strong>Rol:</strong> {user.role}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminUsersList;
