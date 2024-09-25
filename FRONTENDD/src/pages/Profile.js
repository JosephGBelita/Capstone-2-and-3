import { useState, useEffect, useContext } from 'react';
import { Container, Button, Form, Table } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function Profile() {
    const notyf = new Notyf();
    const { user } = useContext(UserContext);
    const [details, setDetails] = useState({ firstName: '', lastName: '', mobileNo: '' });
    const [isUpdating, setIsUpdating] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data && !data.error) {
                setDetails(data);
            } else {
                notyf.error(data.error || "Something went wrong. Contact your system admin.");
            }
        });
    }, []);

    const handleUpdate = (e) => {
        e.preventDefault();
        setIsUpdating(true);

        fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                firstName: details.firstName,
                lastName: details.lastName,
                mobileNo: details.mobileNo
            })
        })
        .then(res => res.json())
        .then(data => {
            setIsUpdating(false);
            if (data) {
                notyf.success("Profile updated successfully!");
            } else {
                notyf.error(data.error || "Failed to update profile.");
            }
        });
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/update-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ newPassword: password })
            });

            if (response.ok) {
                setMessage('Password reset successfully');
                setPassword('');
                setConfirmPassword('');
            } else {
                const errorData = await response.json();
                setMessage(errorData.message);
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
            console.error(error);
        }
    };

    return (
        user.id === null ? 
            <Navigate to="/products" />
            :
            <Container className="mt-5">
                <h1 className="my-5">Profile</h1>
                <Table striped bordered hover>
                    <tbody>
                        <tr>
                            <td>First Name</td>
                            <td>
                                <Form.Control
                                    type="text"
                                    value={details.firstName}
                                    onChange={(e) => setDetails({ ...details, firstName: e.target.value })}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Last Name</td>
                            <td>
                                <Form.Control
                                    type="text"
                                    value={details.lastName}
                                    onChange={(e) => setDetails({ ...details, lastName: e.target.value })}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Mobile No</td>
                            <td>
                                <Form.Control
                                    type="text"
                                    value={details.mobileNo}
                                    onChange={(e) => setDetails({ ...details, mobileNo: e.target.value })}
                                    required
                                />
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <Button variant="primary" onClick={handleUpdate} disabled={isUpdating}>
                    {isUpdating ? 'Updating...' : 'Update Profile'}
                </Button>

                <h2 className="mt-4">Reset Password</h2>
                <Table striped bordered hover>
                    <tbody>
                        <tr>
                            <td>New Password</td>
                            <td>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Confirm Password</td>
                            <td>
                                <Form.Control
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </td>
                        </tr>
                    </tbody>
                </Table>
                {message && <div className="alert alert-warning">{message}</div>}
                <Button variant="warning" onClick={handleResetPassword} className="mt-3">
                    Reset Password
                </Button>
            </Container>
    );
}
