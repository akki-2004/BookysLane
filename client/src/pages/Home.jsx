import React, { useEffect, useState } from 'react';
import { useFireBase } from '../context/Firebase';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import BookCard from '../components/BookCard';
import { Navigate } from 'react-router-dom';

export default function Home() {
  const firebase = useFireBase();
  const { isLoggedIn } = firebase;
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const fetchBooks = async () => {
      try {
        const snapshot = await firebase.listAllBooks();
        const bookData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBooks(bookData);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [firebase, isLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Container className='my-5'>
      <h2 className='mb-4 text-center'>Listed Books</h2>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : books.length > 0 ? (
        <Row className="g-4">
          {books.map((book) => (
            <Col key={book.id} xs={12} sm={6} md={4} lg={3}>
              <BookCard
                id={book.id}
                name={book.name}
                isbn={book.isbn}
                price={book.price}
                coverUrl={book.coverUrl}
                displayName={book.displayName}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center">No books found.</p>
      )}
    </Container>
  );
}
