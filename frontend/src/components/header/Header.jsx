import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideoCamera, faHouse, faBookmark, faEdit, faUser } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDescope, useSession, useUser } from "@descope/react-sdk";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const Header = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSession();
    const { user } = useUser();
    const { logout } = useDescope();
    const [userRole, setUserRole] = useState('User');

    useEffect(() => {
        if (user?.roleNames?.includes('admin')) {
            setUserRole('Admin');
        } else {
            setUserRole('User');
        }
    }, [user]);

    const handleLogout = () => {
        logout();
    };

    const home = () => {
        navigate("/");
    };

    const handleLogin = () => {
        navigate("/login");
    };

    const handleRegister = () => {
        navigate("/register");
    };

    const renderTooltip = (props) => (
        <Tooltip id="user-tooltip" {...props}>
            {userRole}
        </Tooltip>
    );

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
                <Container fluid>
                    <Navbar.Brand onClick={home} style={{ color: "gold", cursor: "pointer" }}>
                        <FontAwesomeIcon icon={faVideoCamera} /> CineScope
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: "100px" }} navbarScroll>
                            <NavLink className="nav-link" to="/">
                                <FontAwesomeIcon icon={faHouse} className="me-1" />
                                Home
                            </NavLink>
                            {/* <NavLink className="nav-link" to="/watchlist">
                                <FontAwesomeIcon icon={faBookmark} className="me-1" />
                                Watch List
                            </NavLink> */}
                            {userRole === 'Admin' && (
                                <NavLink className="nav-link" to="/manage">
                                    <FontAwesomeIcon icon={faEdit} className="me-1" />
                                    Manage Movies
                                </NavLink>
                            )}
                        </Nav>
                        <>
                            {isAuthenticated ? (
                                <>
                                    <OverlayTrigger
                                        placement="bottom"
                                        delay={{ show: 250, hide: 250 }}
                                        overlay={renderTooltip}
                                    >
                                        <span className="fs-6 px-3 py-2 me-3" style={{cursor: 'pointer'}}>
                                            <FontAwesomeIcon icon={faUser} className="px-2 me-1" />
                                            {user?.name || "User"}
                                        </span>
                                    </OverlayTrigger>
                                    <Button variant="outline-info" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="outline-info" className="me-2" onClick={handleLogin}>
                                        Login
                                    </Button>
                                    <Button variant="outline-info" onClick={handleRegister}>
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
