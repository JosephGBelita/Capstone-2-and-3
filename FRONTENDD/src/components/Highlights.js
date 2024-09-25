import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Highlights() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch active products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/products`);

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">
        Featured Products
      </h2>
      <Row className="justify-content-center">
        {products.length > 0 ? (
          products.slice(0, 6).map((product) => (  // Display only the first six products
            <Col xs={12} md={4} key={product._id}>
              <Card className="mb-4 shadow" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
                <Card.Body style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Card.Title as="h5">
                      <Button variant="link" onClick={() => navigate(`/products/${product._id}`)} style={{ padding: 0, textAlign: 'left' }}>
                        {product.name}
                      </Button>
                    </Card.Title>
                    <Card.Text style={{ overflowY: 'auto', flex: 1, maxHeight: '150px', marginBottom: 0 }}>
                      {product.description}
                    </Card.Text>
                  </div>
                  <hr style={{ margin: '5px 0' }} />
                  <div style={{ textAlign: 'left', marginTop: 'auto' }}>
                    <div style={{ color: 'orange', fontWeight: 'bold' }}>
                      ₱{product.price.toFixed(2)}
                    </div>
                    <Button variant="primary" onClick={() => navigate(`/products/${product._id}`)} style={{ width: '100%', marginTop: '10px' }}>
                      Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No featured products available.</p>
        )}
      </Row>
    </div>
  );
}