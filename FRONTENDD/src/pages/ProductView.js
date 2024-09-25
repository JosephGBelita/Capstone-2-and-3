import { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, InputGroup, FormControl, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function ProductView() {
  const notyf = new Notyf();
  const { productId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: "", description: "", price: 0 });
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/products/specific/${productId}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setProduct(data);
        } else {
          notyf.error('Product details not found!');
        }
      })
      .catch(error => {
        notyf.error('Failed to fetch product details!');
        console.error('Fetch error:', error);
      });
  }, [productId]);

  const addToCart = () => {
    if (!user || !user.id) {
      notyf.error('You need to log in to add items to your cart.');
      navigate('/login');
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/cart/add-to-cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        cartItems: [{ productId: productId, quantity }]
      })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then(data => {
      if (data.success) {
        notyf.success(data.message);
        navigate('/cart'); 
      } else {
        notyf.error(data.message);
      }
    })
    .catch(error => {
      notyf.error('An error occurred: ' + error.message);
      console.error('Add to cart error:', error);
    });
  };

  const handleQuantityChange = (value) => {
    const quantityValue = Number(value);
    if (!isNaN(quantityValue) && quantityValue > 0) {
      setQuantity(quantityValue);
    }
  };

  return (
    <Container>
      <Table bordered>
        <tbody>
          <tr>
            <td colSpan="2" style={{ backgroundColor: 'black', color: 'white', textAlign: 'center' }}>
              <h5>{product.name}</h5>
            </td>
          </tr>
          <tr>
            <td colSpan="2" style={{ backgroundColor: 'white', color: 'black' }}>
              <Row>
                <Col>
                  <p>{product.description}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p>Price: ₱{product.price}</p>
                </Col>
              </Row>
            </td>
          </tr>
          <tr>
            <td colSpan="2" style={{ backgroundColor: 'white', color: 'black' }}>
              <Row className="align-items-center">
                <Col xs={6}>
                  <InputGroup>
                    <Button variant="secondary" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                    <FormControl
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                    />
                    <Button variant="secondary" onClick={() => setQuantity(quantity + 1)}>+</Button>
                  </InputGroup>
                </Col>
                <Col xs={6}>
                  <Button variant="primary" onClick={addToCart}>Add to Cart</Button>
                </Col>
              </Row>
            </td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
}
