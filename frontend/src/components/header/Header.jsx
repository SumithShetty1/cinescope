import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideoCamera, faHouse, faBookmark, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCallback } from "react";
import { Descope, getSessionToken, useDescope, useSession, useUser } from "@descope/react-sdk";

const Header = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isSessionLoading } = useSession();
    const { user, isUserLoading } = useUser();
    const { logout } = useDescope();

    const handleLogout = () => {
        logout(); // Ends session and resets state
    };

    const home = () => {
        navigate("/");
    };
    const [showSignUpButtons, setShowSignUpButtons] = useState(false);

    const handleLogin = () => {
        navigate("/login");
    };

    const handleRegister = () => {
        navigate("/register");
    };
    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
                <Container fluid>
                    <Navbar.Brand
                        onClick={home}
                        style={{ color: "gold", cursor: "pointer" }}
                    >
                        <FontAwesomeIcon icon={faVideoCamera} /> CineScope
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: "100px" }}
                            navbarScroll
                        >
                            <NavLink className="nav-link" to="/">
                                <FontAwesomeIcon icon={faHouse} className="me-1" />
                                Home
                            </NavLink>
                            <NavLink className="nav-link" to="/watchlist">
                                <FontAwesomeIcon icon={faBookmark} className="me-1" />
                                Watch List
                            </NavLink>
                            <NavLink className="nav-link" to="/admin">
                                <FontAwesomeIcon icon={faShieldAlt} className="me-1" />
                                Admin
                            </NavLink>
                        </Nav>
                        <>
                            {isAuthenticated ? (
                                <>
                                    <span className="fs-6 px-3 py-2 me-3">
                                        Hello {user?.name || "User"}!
                                    </span>
                                    <Button
                                        variant="outline-info"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        variant="outline-info"
                                        className="me-2"
                                        onClick={handleLogin}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        variant="outline-info"
                                        onClick={handleRegister}
                                    >
                                        Register
                                    </Button>
                                </>
                            )}
                        </>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default Header;
