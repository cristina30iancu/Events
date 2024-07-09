// src/components/NavigationBar.js
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import './NavigationBar.css'; // Stiluri pentru navbar
import logo from './couple.png'

const NavigationBar = () => {
  const { state, dispatch } = useAuth();
  const [noItems, setNoItems] = useState(0);
  const [noItemsFav, setNoItemsFav] = useState(0);

  useEffect(() => {
  
  }, [state.isAuthenticated, state.id]);

  const onLogOut = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    dispatch({ type: 'SET_ADMIN', payload: false });
    window.location.href = "/";
  };

  return (
    <Navbar bg="dark" expand="lg" variant="dark" className="custom-navbar">
      <Navbar.Brand href="/" className="mx-3">
        <img
          alt="logo"src={logo} width="50" height="50"className="d-inline-block align-top"
        /> 
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarNav" />
      <Navbar.Collapse id="navbarNav" className="mx-3">
        <Nav className="m-auto">
          {state.isAuthenticated && state.isAdmin && (
            <NavDropdown title="Restaurante" className="my-3">
              <NavDropdown.Item href="/add-restaurant/">Adaugă</NavDropdown.Item>
              <NavDropdown.Item href="/restaurants">Vizualizează</NavDropdown.Item>
            </NavDropdown>
          )}
           {state.isAuthenticated && !state.isAdmin && (
            <Nav.Link className="my-3" href="/restaurants">Rezervă</Nav.Link>
          )}
           {state.isAuthenticated && state.isAdmin &&
           <Nav.Link className="my-3" href="/services">Servicii</Nav.Link>}
            {state.isAuthenticated && state.isAdmin &&
           <Nav.Link className="my-3" href="/admin/users">Utilizatori</Nav.Link>}
            {state.isAuthenticated && state.isAdmin &&
           <Nav.Link className="my-3" href="/reservations-admin">Rezervări</Nav.Link>}
            {state.isAuthenticated && !state.isAdmin &&
           <Nav.Link className="my-3" href="/reservations-user">Rezervări</Nav.Link>}
        </Nav>
        
        <Nav>
          {state.isAuthenticated ? (
            <Nav.Link onClick={onLogOut} className="my-2">
              <Button variant="outline-danger">Ieși din cont</Button>
            </Nav.Link>
          ) : (
            <Nav.Link href="/login" className="my-2">
              <Button variant="outline-primary">Intră în cont</Button>
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;