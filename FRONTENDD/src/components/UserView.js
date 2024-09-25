import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductSearch from './ProductSearch';
import { Row, Col } from 'react-bootstrap';

export default function UserView({ productsData }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const productsArr = productsData.map(product => {
            if (product.isActive === true) {
                return (
                    <Col xs={12} md={4} key={product._id}>
                        <ProductCard productProp={product} />
                    </Col>
                );
            } else {
                return null;
            }
        }).filter(Boolean); // Remove any null values

        setProducts(productsArr);
    }, [productsData]);

    return (
        <>
            <ProductSearch />
            <h2 className="text-center mt-4">Our Products</h2> {/* New Title */}
            <Row className="justify-content-center">
                {products}
            </Row>
        </>
    );
}
