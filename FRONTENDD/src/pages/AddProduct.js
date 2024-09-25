import { useState, useContext } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function AddCourse({ show, handleClose, fetchData }) {
  const notyf = new Notyf();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // Input states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');

  // Function to handle course creation
  const createCourse = (e) => {
    e.preventDefault();
    let token = localStorage.getItem('token');

    fetch(`${process.env.REACT_APP_API_URL}/products/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        description,
        price,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Course already exists') {
          notyf.error('Error: Course already exists.');
        } else if (data.success === true) {
          setName('');
          setDescription('');
          setPrice('0');

          notyf.success('Product added successfully');
          fetchData(); 
          handleClose(); 
        } else {
          notyf.error('Error: Something went wrong.');
        }
      });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={createCourse}>
          <Form.Group className="mb-3">
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price:</Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={price}
              required
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="success" onClick={createCourse}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
