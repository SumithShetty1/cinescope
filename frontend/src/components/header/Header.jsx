import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideoCamera } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import { Descope } from "@descope/react-sdk";
import { useState } from "react";

const Header = () => {
    const navigate = useNavigate();

    const home = () => {
        navigate("/");
    };
    const [showAuth, setShowAuth] = useState(false);
    const [flowId, setFlowId] = useState("sign-up-or-in"); // default flow

    const handleLogin = () => {
        //setFlowId("sign-in");
        //setShowAuth(true);
        navigate("/login");
    };

    const handleRegister = () => {
        //setFlowId("sign-up"); // or use a different flow like "sign-up-only" if configured
        //setShowAuth(true);
        navigate("/register");
    };
    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
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
                                Home
                            </NavLink>
                            <NavLink className="nav-link" to="/watchList">
                                Watch List
                            </NavLink>
                        </Nav>
                        <Button
                            variant="outline-info"
                            className="me-2"
                            onClick={handleLogin}
                        >
                            Login
                        </Button>
                        <Button variant="outline-info" onClick={handleRegister}>
                            Register
                        </Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {showAuth && (
                <div
                    style={{
                        position: "absolute",
                        top: "80px",
                        right: "20px",
                        zIndex: 1000,
                    }}
                >
                    <Descope
                        flowId={flowId}
                        onSuccess={(e) => {
                            console.log("Logged in:", e.detail.user);
                            setShowAuth(false);
                        }}
                        onError={(e) => {
                            console.error("Auth error", e);
                            setShowAuth(false);
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default Header;
