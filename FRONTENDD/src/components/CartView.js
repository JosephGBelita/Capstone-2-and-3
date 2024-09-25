import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

function CartView() {
  const notyf = new Notyf();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      notyf.error("You need to be logged in to view your cart.");
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/cart/get-cart`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.cart && data.cart.cartItems.length > 0) {
          setCartItems(data.cart.cartItems);
          setTotalPrice(data.cart.totalPrice);
        } else {
          setCartItems([]);
          setTotalPrice(0);
          notyf.error("Your cart is empty.");
        }
      })
      .catch(error => {
        console.error("Fetch cart error:", error);
        notyf.error("Failed to load cart items.");
      });
  }, []);

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity < 1) return;

    fetch(`${process.env.REACT_APP_API_URL}/cart/update-cart-quantity`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        itemId: itemId,
        quantity: quantity
      })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then(data => {
      if (data.message === 'Item quantity updated successfully.') {
        setCartItems(currentItems =>
          currentItems.map(item =>
            item.productId === itemId 
              ? { ...item, quantity: data.updatedCart.cartItems.find(i => i.productId === itemId).quantity, subtotal: data.updatedCart.cartItems.find(i => i.productId === itemId).subtotal }
              : item
          )
        );
        setTotalPrice(data.updatedCart.totalPrice);
      } else {
        notyf.error('Failed to update quantity');
      }
    })
    .catch(error => {
      notyf.error('An error occurred while updating quantity: ' + error.message);
      console.error('Update quantity error:', error);
    });
  };

  const handleRemove = (itemId) => {
    fetch(`${process.env.REACT_APP_API_URL}/cart/${itemId}/remove-from-cart`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then(data => {
      if (data.message === 'Item removed from cart successfully.') {
        setCartItems(currentItems =>
          currentItems.filter(item => item.productId !== itemId)
        );
        setTotalPrice(data.totalPrice);
      } else {
        notyf.error('Failed to remove item: ' + data.message);
      }
    })
    .catch(error => {
      notyf.error('An error occurred while removing the item: ' + error.message);
      console.error('Remove item error:', error);
    });
  };

  const handleClearCart = () => {
    fetch(`${process.env.REACT_APP_API_URL}/cart/clear-cart`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'Cart cleared successfully.') {
        setCartItems([]);
        setTotalPrice(0);
      } else {
        notyf.error('Failed to clear cart');
      }
    })
    .catch(error => {
      notyf.error('An error occurred');
      console.error('Clear cart error:', error);
    });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      notyf.error('Your cart is empty! Please add items before proceeding to checkout.');
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/orders/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        cartItems: cartItems,
        totalPrice: totalPrice,
      })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then(data => {
      if (data.message === 'Order placed successfully') {
        notyf.success("Order Successful");
        setCartItems([]);
        setTotalPrice(0);
        navigate("/products");
      } else {
        notyf.error(data.message || "Internal Server Error. Notify System Admin.");
      }
    })
    .catch(error => {
      notyf.error('An error occurred: ' + error.message);
      console.error('Checkout error:', error);
    });
  };

  return (
    <Container className="mt-4"> {/* Margin top for space after navbar */}
      <h3 className="text-center">Your Shopping Cart</h3>
      <Table bordered className="text-center mb-4"> {/* Margin bottom for space after table */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <tr key={item.productId}>
              <td>{item.productName}</td>
              <td>₱{item.price}</td>
              <td>
                <div className="quantity-control">
                  <Button variant="light" onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}>-</Button>
                  <Form.Control
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.productId, Number(e.target.value))}
                    style={{ width: '60px', display: 'inline' }}
                  />
                  <Button variant="light" onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}>+</Button>
                </div>
              </td>
              <td>₱{item.subtotal}</td>
              <td>
                <Button variant="danger" onClick={() => handleRemove(item.productId)}>Remove</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Row className="justify-content-between align-items-center">
        <Col xs={6} className="text-start">
          <Button variant="success" onClick={handleCheckout} disabled={cartItems.length === 0}>
            Checkout
          </Button>
        </Col>
        <Col xs={6} className="text-end">
          <h5>Total Price: ₱{totalPrice}</h5>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-start">
          <Button variant="warning" onClick={handleClearCart}>Clear Cart</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default CartView;
