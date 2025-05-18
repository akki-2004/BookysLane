import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner } from "react-bootstrap";
import { useFireBase } from "../context/Firebase";
import { Navigate } from "react-router-dom";

export default function ListBooks() {
  const firebase = useFireBase();
  const { isLoggedIn, handleCreate, listAllBooks } = firebase;

  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [isbnNumber, setIsbnNumber] = useState("");
  const [price, setPrice] = useState("");
  const [coverPic, setCoverPic] = useState("");
  const [creating, setCreating] = useState(false);


  // Fetch books on mount
  useEffect(() => {
    const fetchBooks = async () => {
      setLoadingBooks(true);
      try {
        const snapshot = await listAllBooks();
        const booksList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBooks(booksList);
      } catch (err) {
        setError("Failed to load books");
        console.error(err);
      } finally {
        setLoadingBooks(false);
      }
    };

    fetchBooks();
  }, [listAllBooks]);

  // Handle new book creation
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !isbnNumber || !price || !coverPic) {
      alert("Please fill all fields and add a cover picture URL.");
      return;
    }

    setCreating(true);
    try {
      await handleCreate(name, isbnNumber, price, coverPic);
      alert("Book created successfully!");
      // Reset form
      setName("");
      setIsbnNumber("");
      setPrice("");
      setCoverPic("");
      // Refresh book list
      const snapshot = await listAllBooks();
      setBooks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error creating book:", err);
      alert("Failed to create book. Please try again.");
    }
    setCreating(false);
  };

  return (
    <Container className="my-5">
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header as="h5">Add a New Book</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBookName">
                  <Form.Label>Book Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter book name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formISBN">
                  <Form.Label>ISBN</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter ISBN"
                    value={isbnNumber}
                    onChange={(e) => setIsbnNumber(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPrice">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formCoverPic">
                  <Form.Label>Cover Picture URL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter cover picture URL"
                    value={coverPic}
                    onChange={(e) => setCoverPic(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={creating} className="w-100">
                  {creating ? (
                    <>
                      <Spinner animation="border" size="sm" /> Creating...
                    </>
                  ) : (
                    "Create Book"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <h4>Books List</h4>
          {loadingBooks ? (
            <Spinner animation="border" />
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : books.length === 0 ? (
            <p>No books found.</p>
          ) : (
            books.map((book) => (
              <Card key={book.id} className="mb-3">
                <Row className="g-0">
                  <Col md={4}>
                    <Card.Img src={book.coverUrl} alt={book.name} />
                  </Col>
                  <Col md={8}>
                    <Card.Body>
                      <Card.Title>{book.name}</Card.Title>
                      <Card.Text>
                        <strong>ISBN:</strong> {book.isbn} <br />
                        <strong>Price:</strong> ${book.price}
                      </Card.Text>
                      <Card.Text>
                        <small>Added by: {book.displayName || book.userEmail || "Unknown"}</small>
                      </Card.Text>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
}
