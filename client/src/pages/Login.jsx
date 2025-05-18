import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useFireBase } from '../context/Firebase';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Alert, Modal } from 'react-bootstrap';

export default function Login() {
    const help = useFireBase();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (help.isLoggedIn) {
            navigate("/");
        }
    }, [help.isLoggedIn, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            await help.signInUser(email, password);
            console.log("Successful Login");
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to login. Please try again.");
        }
    };

    const handleGoogleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            await help.signInUserWithGoogle();
            console.log("Successful Google Login");
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to login with Google. Please try again.");
        }
    };

    const handleForgotPassword = async () => {
        setError(null);
        setSuccess(null);
        if (!forgotEmail) {
            setError("Please enter your email address.");
            return;
        }
        try {
            await help.sendPasswordResetEmail(forgotEmail);
            setSuccess("Password reset email sent! Check your inbox.");
            setShowForgotModal(false);
            setForgotEmail("");
        } catch (err) {
            setError(err.message || "Failed to send reset email. Please try again.");
        }
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={6} lg={4}>
                    <Card>
                        <Card.Header as="h5" className="text-center">Login</Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100">
                                    Submit
                                </Button>
                            </Form>

                            <div className="text-center mt-3">
                                <Button variant="link" onClick={() => setShowForgotModal(true)}>
                                    Forgot Password?
                                </Button>
                            </div>

                            <h3 className="text-center my-4">Or</h3>

                            <Button
                                variant="danger"
                                onClick={handleGoogleSubmit}
                                className="w-100"
                            >
                                Sign In With Google
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Forgot Password Modal */}
            <Modal show={showForgotModal} onHide={() => setShowForgotModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formForgotEmail">
                        <Form.Label>Enter your email address:</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowForgotModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleForgotPassword}>
                        Send Reset Email
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
