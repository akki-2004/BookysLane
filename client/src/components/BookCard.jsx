import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";

const BookCard = ({ id, name, isbn, price, coverUrl, displayName }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/book/${id}`);
  };

  return (
    <Card style={{ width: "18rem" }} className="mb-4">
      {coverUrl && (
        <Card.Img
          variant="top"
          src={coverUrl}
          alt={name}
          style={{ height: "200px", objectFit: "cover" }}
        />
      )}
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>
          This book has a title {name}, sold by {displayName} and costs ₹{price}.
        </Card.Text>
        <Button variant="primary" onClick={handleViewDetails}>
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
};

export default BookCard;
