import { useState, useEffect } from 'react';
import { Button, Table, Container, Row, Col, Card } from 'react-bootstrap';
import EditProduct from './EditProduct';
import ArchiveProduct from './ArchiveProduct';
import AddProduct from '../pages/AddProduct';

export default function AdminView({ productsData, fetchData }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Effect for rendering the product data
  useEffect(() => {
    const productsArr = productsData.map((product) => (
      <tr key={product._id}>
        <td>{product.name}</td>
        <td>{product.description}</td>
        <td>{product.price}</td>
        <td className={product.isActive ? 'text-success' : 'text-danger'}>
          {product.isActive ? 'Available' : 'Unavailable'}
        </td>
        <td className="text-center">
          <EditProduct product={product} fetchData={fetchData} />
          <ArchiveProduct product={product} isActive={product.isActive} fetchData={fetchData} />
        </td>
      </tr>
    ));

    setProducts(productsArr);
  }, [productsData]);

  // Effect for fetching all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/orders/all-orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        const ordersArr = data.orders.map(order => (
          <>
            <tr key={order._id}>
              <td colSpan="4" className="bg-dark text-white text-left">
                <strong>Order for User:</strong> <span className="text-warning">{order._id}</span>
              </td>
            </tr>
            <tr key={`${order._id}-details`}>
              <td colSpan="4">
                <div>
                Items:<br />
                Purchased on {new Date(order.orderedOn).toLocaleDateString()}</div>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                  {order.productsOrdered.map(item => (
                    <li key={item.productId}>
                      {item.productId.name} - Quantity: {item.quantity}
                    </li>
                  ))}
                </ul>
                 <hr />
                <div>Total: ₱{order.totalPrice.toFixed(2)}</div>
              </td>
            </tr>
          </>
        ));

        setOrders(ordersArr);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (showOrders) {
      fetchOrders();
    }
  }, [showOrders]);

  const toggleView = () => {
    setShowOrders(!showOrders);
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-3">
        <Col className="d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Admin Dashboard</h2>
        </Col>
      </Row>

      <Row className="justify-content-center mb-3">
        <Col md="auto">
          <Button variant="primary" onClick={() => setShowAddProduct(true)} className="me-2">
            Add New Product
          </Button>
          <Button variant={showOrders ? 'danger' : 'success'} onClick={toggleView}>
            {showOrders ? 'Show Product Details' : 'Show User Orders'}
        </Button>

        </Col>
      </Row>

      {/* Show Add Product Modal */}
      <AddProduct
        show={showAddProduct}
        handleClose={() => setShowAddProduct(false)}
        fetchData={fetchData}
      />

      <Row className="mt-4">
        <Col>
          <Card className="mb-4">
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr className="text-center">
                    {!showOrders ? (
                      <>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Availability</th>
                        <th>Actions</th>
                      </>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {!showOrders ? products : orders}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
