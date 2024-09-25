import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function Register() {

    const notyf = new Notyf();
    const { user } = useContext(UserContext);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (
            firstName !== "" && 
            lastName !== "" && 
            email !== "" && 
            mobileNo.length === 11 && 
            password !== "" && 
            confirmPassword !== "" && 
            password === confirmPassword
        ) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [firstName, lastName, email, mobileNo, password, confirmPassword]);

    function registerUser(e) {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName, lastName, email, mobileNo, password
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "User registered successfully") {
                setFirstName('');
                setLastName('');
                setEmail('');
                setMobileNo('');
                setPassword('');
                setConfirmPassword('');
                notyf.success("Registration successful");
            } else {
                notyf.error("Something went wrong.");
            }
        });
    }

    return (
        (user.id !== null) ? 
            <Navigate to="/courses" />
            : 
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md={8} lg={6}>
                    <h1 className="text-center mb-4">Register</h1> {/* Register title outside the box */}
                    <Card className="shadow">
                        <Card.Body>
                            <Form onSubmit={(e) => registerUser(e)}>
                                <Form.Group className="mb-3">
                                    <Form.Label>First Name:</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Enter First Name" 
                                        value={firstName}
                                        onChange={e => setFirstName(e.target.value)} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Last Name:</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Enter Last Name" 
                                        value={lastName}
                                        onChange={e => setLastName(e.target.value)} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email:</Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        placeholder="Enter Email" 
                                        value={email}
                                        onChange={e => setEmail(e.target.value)} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Mobile No:</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        placeholder="Enter 11 Digit No." 
                                        value={mobileNo}
                                        onChange={e => setMobileNo(e.target.value)} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Password:</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        placeholder="Enter Password" 
                                        value={password}
                                        onChange={e => setPassword(e.target.value)} 
                                        required 
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Confirm Password:</Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        placeholder="Confirm Password" 
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)} 
                                        required 
                                    />
                                </Form.Group>

                                <hr /> {/* Line separating the form fields and the button */}

                                {isActive ? 
                                    <Button variant="primary" type="submit" className="w-100">Please enter your registration details</Button>
                                    : 
                                    <Button variant="danger" type="submit" className="w-100" disabled>Please enter your registration details</Button>
                                }
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* "Already have an account" text below and outside the box */}
                    <div className="text-center mt-3">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary">
                                Click here
                            </Link>{' '}
                            to log in.
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
