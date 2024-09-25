import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Banner({ data }) {
    const { title, content, buttonLabel } = data;
    const destination = '/products'; 

    return (
        <Row className="text-center mt-4"> 
            <Col>
                <h1 style={{ fontStyle: 'italic' }}>{title}</h1> {/* Italicized title */}
                <p style={{ fontStyle: 'italic' }}>{content}</p> 
                <Link to={destination}>
                    <Button variant="primary">{buttonLabel}</Button>
                </Link>
            </Col>
        </Row>
    );
}
