import React from "react";
import { Container, Card, Table, Row, Col, Button } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { useFireBase } from "../context/Firebase"; // adjust path

const PaymentReceiptPage = () => {
  const { cartItems, totalPrice } = useCart();
  const { user } = useFireBase();

  // Dummy order info
  const orderId = "ORD" + Math.floor(100000 + Math.random() * 900000);
  const orderDate = new Date().toLocaleString();

  return (
    <Container className="my-5">
      <Card className="p-4 shadow">
        <h2 className="mb-4 text-center text-success">Payment Receipt</h2>

        <Row className="mb-3">
          <Col>
            <p><strong>Order ID:</strong> {orderId}</p>
            <p><strong>Customer Name:</strong> {user?.displayName || "Guest"}</p>
            <p><strong>Email:</strong> {user?.email || "Not provided"}</p>
            <p><strong>Order Date:</strong> {orderDate}</p>
          </Col>
        </Row>

        <Table striped bordered hover responsive>
          <thead className="table-primary">
            <tr>
              <th>Book</th>
              <th>Price (₹)</th>
              <th>Quantity</th>
              <th>Subtotal (₹)</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">No items purchased.</td>
              </tr>
            ) : (
              cartItems.map(({ id, name, price, quantity }) => (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{price?.toFixed(2)}</td>
                  <td>{quantity}</td>
                  <td>{(price * quantity).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        <Row className="justify-content-end mt-3">
          <Col xs="auto">
            <h4>Total Paid: ₹{totalPrice.toFixed(2)}</h4>
          </Col>
        </Row>

        <p className="mt-4 text-success text-center fs-5">
          Thank you for your order! Your payment has been received, and your books will be shipped soon.
        </p>

        <div className="text-center">
          <Button variant="primary" onClick={() => window.location.href = "/"}>
            Continue Shopping
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default PaymentReceiptPage;
