import React, { useState } from "react";
import { Container, Table, Button, Form, Row, Col, Alert, Spinner, Card } from "react-bootstrap";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice, loading } = useCart();
  const [showReceipt, setShowReceipt] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderSnapshot, setOrderSnapshot] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [orderDate, setOrderDate] = useState("");

  const saveOrderToDB = async (order) => {
    // Replace with your backend API URL
    const apiUrl = "/api/orders";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });
      if (!response.ok) {
        throw new Error("Failed to save order");
      }
      // Optionally handle response data here
    } catch (error) {
      console.error("Error saving order:", error);
      // You can show an alert or message to user here if needed
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    setCheckoutLoading(true);

    setTimeout(async () => {
      // Create order details
      const newOrderId = "ORD" + Math.floor(100000 + Math.random() * 900000);
      const newOrderDate = new Date().toLocaleString();

      // Save snapshot of cart and order info
      setOrderSnapshot(cartItems);
      setOrderId(newOrderId);
      setOrderDate(newOrderDate);

      // Prepare order data for backend
      const orderData = {
        orderId: newOrderId,
        orderDate: newOrderDate,
        items: cartItems,
        total: totalPrice,
      };

      // Save order to database
      await saveOrderToDB(orderData);

      setCheckoutLoading(false);
      setShowReceipt(true);
    }, 2000); // Simulate 2 seconds processing
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (checkoutLoading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3 fs-5">Processing your payment, please wait...</p>
      </Container>
    );
  }

  if (cartItems.length === 0 && !showReceipt) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="info" className="py-4 fs-4">
          Your cart is empty.
        </Alert>
      </Container>
    );
  }

  if (showReceipt) {
    return (
      <Container className="my-5">
        <Card className="p-4 shadow">
          <h2 className="mb-4 text-center text-success">Payment Receipt</h2>

          <Row className="mb-3">
            <Col>
              <p><strong>Order ID:</strong> {orderId}</p>
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
              {orderSnapshot.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center">No items purchased.</td>
                </tr>
              ) : (
                orderSnapshot.map(({ id, name, price, quantity }) => (
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
              <h4>Total Paid: ₹{orderSnapshot.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</h4>
            </Col>
          </Row>

          <p className="mt-4 text-success text-center fs-5">
            Thank you for your order! Your payment has been received, and your books will be shipped soon.
          </p>

          <div className="text-center">
            <Button
              variant="primary"
              onClick={() => {
                clearCart();
                setShowReceipt(false);
                setOrderSnapshot([]);
                setOrderId("");
                setOrderDate("");
              }}
            >
              Back to Shopping
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  // Default cart view
  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center text-primary fw-bold">Your Cart</h2>
      <Table striped bordered hover responsive className="shadow-sm rounded">
        <thead className="table-primary">
          <tr>
            <th>Book</th>
            <th>Price (₹)</th>
            <th style={{ width: "120px" }}>Quantity</th>
            <th>Subtotal (₹)</th>
            <th style={{ width: "100px" }}>Remove</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(({ id, name, price, quantity }) => (
            <tr key={id}>
              <td className="align-middle">{name}</td>
              <td className="align-middle">{typeof price === "number" ? price.toFixed(2) : "N/A"}</td>
              <td className="align-middle">
                <Form.Control
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => updateQuantity(id, parseInt(e.target.value))}
                  className="text-center"
                />
              </td>
              <td className="align-middle">
                {typeof price === "number" && typeof quantity === "number"
                  ? (price * quantity).toFixed(2)
                  : "N/A"}
              </td>
              <td className="align-middle text-center">
                <Button variant="danger" size="sm" onClick={() => removeFromCart(id)}>
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Row className="justify-content-end align-items-center mt-4">
        <Col xs="auto">
          <h4 className="fw-bold">Total: ₹{totalPrice.toFixed(2)}</h4>
        </Col>
      </Row>

      <Row className="justify-content-end mt-3">
        <Col xs="auto">
          <Button variant="secondary" onClick={clearCart} className="me-3 px-4">
            Clear Cart
          </Button>
          <Button
            variant="primary"
            onClick={handleCheckout}
            className="px-4"
          >
            Checkout
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
