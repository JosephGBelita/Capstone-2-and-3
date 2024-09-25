import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function Login() {

    const notyf = new Notyf();
    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(true);

    function authenticate(e) {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.access !== undefined) {
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);
                setEmail('');
                setPassword('');
                notyf.success('Successful Login');
            } else if (data.message === "Incorrect email or password") {
                notyf.error('Incorrect Credentials. Try Again');
            } else {
                notyf.error('User Not Found. Try Again.');
            }
        });
    }

    function retrieveUserDetails(token) {
        fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            setUser({ id: data._id, isAdmin: data.isAdmin });
        });
    }

    useEffect(() => {
        if (email !== '' && password !== '') {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password]);

    return (
        (user.id !== null) ? <Navigate to="/products" /> : 
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md={8} lg={6}>
                    <h1 className="text-center mb-4">Login</h1> {/* Login title outside the box */}
                    <Card className="shadow">
                        <Card.Body>
                            <Form onSubmit={(e) => authenticate(e)}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        placeholder="Enter email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        placeholder="Password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)} 
                                        required 
                                    />
                                </Form.Group>

                                <hr /> {/* Line separator */}

                                { isActive ? 
                                    <Button variant="primary" type="submit" className="w-100">Login</Button>
                                    : 
                                    <Button variant="danger" type="submit" className="w-100" disabled>Login</Button>
                                }
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* Text below the box with clickable "Click here" */}
                    <div className="text-center mt-3">
                        <p>
                            Don't have an account yet?{' '}
                            <Link to="/register" className="text-primary">
                                Click here
                            </Link>{' '}
                            to register.
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
