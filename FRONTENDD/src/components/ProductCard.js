import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ProductCard({ productProp }) {
    const { _id, name, description, price } = productProp;

    return (
        <div className="mb-4"> {/* Margin bottom for spacing */}
            <Card className="h-100">
                <Card.Body className="d-flex flex-column">
                    <Card.Title>
                        <Link to={`/products/${_id}`} style={{ textDecoration: 'none', color: 'blue' }}>
                            {name}
                        </Link>
                    </Card.Title>
                    <Card.Subtitle>Description:</Card.Subtitle>
                    <Card.Text
                        className="flex-grow-1"
                        style={{
                            maxHeight: '100px',
                            overflowY: 'auto', // Scrollable description
                        }}
                    >
                        {description}
                    </Card.Text>
                    
                    <hr /> 
                    
                    <Card.Text style={{ color: 'orange', marginTop: '10px' }}>PhP {price.toFixed(2)}</Card.Text>
                    <Link className="btn btn-primary" to={`/products/${_id}`}>Details</Link>
                </Card.Body>
            </Card>
        </div>
    );
}

// Validations
ProductCard.propTypes = {
    productProp: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
    }).isRequired,
};
