import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, NavLink } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function AppNavbar() {
  const { user } = useContext(UserContext);

  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/">The Zuitt Shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Show "Products" link for non-logged-in users and non-admin users */}
            {(user.id === null || !user.isAdmin) && (
              <Nav.Link as={NavLink} to="/products">Products</Nav.Link>
            )}
            {/* Show "Admin Dashboard" link for admin users */}
            {user.id !== null && user.isAdmin && (
              <Nav.Link as={NavLink} to="/products">Admin Dashboard</Nav.Link>
            )}
          </Nav>
          <Nav className="ms-auto">
            {user.id === null ? (
              <>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
