import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import { useFireBase } from '../context/Firebase';
import { useNavigate } from 'react-router-dom';

function NavBar() {
  const firebase = useFireBase();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await firebase.logout();
    navigate("/login");
  };

  const user = firebase.user;
  const displayName = user?.displayName || "User";
  const userEmail = user?.email || "user@example.com";
  const photoURL = user?.photoURL || user?.photoUrl || "https://via.placeholder.com/30";

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">BooksyLane</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/list">Add Listing</Nav.Link>
        </Nav>

        {firebase.isLoggedIn ? (
          <Dropdown align="end">
            <Dropdown.Toggle variant="secondary" id="dropdown-user">
              <Image
                src={photoURL}
                roundedCircle
                width="30"
                height="30"
                className="me-2"
              />
              {displayName}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Header>
                <strong>{displayName}</strong>
                <br />
                <small>{userEmail}</small>
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item href="/cart">🛒 My Cart</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>🚪 Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Nav>
            <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/register">Register</Nav.Link>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
}

export default NavBar;
