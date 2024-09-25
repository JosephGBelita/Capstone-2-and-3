import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Row, Col, Button, Form, InputGroup } from 'react-bootstrap'; 
import { useNavigate } from 'react-router-dom';

const ProductSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!searchQuery) {
            alert("Please enter a product name.");
            return;
        }

        try {
            const min = minPrice ? parseFloat(minPrice) : undefined;
            const max = maxPrice ? parseFloat(maxPrice) : undefined;

            if (min !== undefined && max !== undefined && min > max) {
                alert("Min Price should not be greater than Max Price");
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/products/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productName: searchQuery,
                    minPrice: min,
                    maxPrice: max
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const filteredData = data.filter(product => {
                if (min !== undefined && product.price < min) return false;
                if (max !== undefined && product.price > max) return false;
                return true;
            });

            setSearchResults(filteredData);
        } catch (error) {
            console.error('Error searching for products:', error);
        }
    };

    const handleClear = () => {
        setSearchQuery('');
        setMinPrice('');
        setMaxPrice('');
        setSearchResults([]);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-3">Product Search</h2>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="productName">Product Name:</Form.Label>
                <Form.Control
                    type="text"
                    id="productName"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Enter Product name"
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="minPrice">Minimum Price:</Form.Label>
                <InputGroup>
                    <Form.Control
                        type="number"
                        id="minPrice"
                        value={minPrice}
                        onChange={(event) => setMinPrice(event.target.value)}
                        placeholder="Enter minimum price"
                    />
                </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="maxPrice">Maximum Price:</Form.Label>
                <InputGroup>
                    <Form.Control
                        type="number"
                        id="maxPrice"
                        value={maxPrice}
                        onChange={(event) => setMaxPrice(event.target.value)}
                        placeholder="Enter maximum price"
                    />
                </InputGroup>
            </Form.Group>

            <div className="mb-3">
                <Button className="me-2" variant="primary" onClick={handleSearch}>
                    Search
                </Button>
                <Button variant="danger" onClick={handleClear}>
                    Clear
                </Button>
            </div>

            <hr />

            <Row className="justify-content-center">
                {searchResults.length > 0 ? (
                    searchResults.map((product) => (
                        <Col xs={12} md={4} key={product._id}>
                            <ProductCard productProp={product} />
                        </Col>
                    ))
                ) : null /* No message if no products found */}
            </Row>
        </div>
    );
};

export default ProductSearch;
