import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFireBase } from "../context/Firebase";
import { Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const BookDetails = () => {
  const { id } = useParams();
  const firebase = useFireBase();
  const { updateQuantity } = useCart();  // renamed here
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const doc = await firebase.getBookById(id);
        if (doc.exists()) {
          setBook({ id: doc.id, ...doc.data() });
        }
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [firebase, id]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!book) {
    return <Container className="my-5">Book not found.</Container>;
  }

  const handleAddToCart = () => {
    updateQuantity(book.id, 1, {
      name: book.name,
      price: Number(book.price),
      displayName: book.displayName,
      isbn: book.isbn,
      coverUrl: book.coverUrl,
    });
    alert("Added to cart successfully!");
    navigate("/cart");
  };

  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          <img
            src={book.coverUrl}
            alt={book.name}
            className="img-fluid rounded shadow"
          />
        </Col>
        <Col md={6}>
          <h2>{book.name}</h2>
          <p><strong>Sold By:</strong> {book.displayName}</p>
          <p><strong>ISBN:</strong> {book.isbn}</p>
          <p><strong>Price:</strong> ₹{Number(book.price).toFixed(2)}</p>

          <Button variant="success" className="me-2" onClick={handleAddToCart}>
            Add to Cart
          </Button>

          <Button variant="primary" onClick={handleAddToCart}>
            Buy Now
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default BookDetails;
