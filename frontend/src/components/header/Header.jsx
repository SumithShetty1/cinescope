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
import SearchBar from "./searchBar/SearchBar";

// Header component responsible for displaying the navigation menu and user authentication options
const Header = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSession();
    const { user } = useUser();
    const { logout } = useDescope();
    const [userRole, setUserRole] = useState('User');

    // Effect to update userRole based on user data
    useEffect(() => {
        if (user?.roleNames?.includes('admin')) {
            setUserRole('Admin');
        } else {
            setUserRole('User');
        }
    }, [user]);

    // Handle user logout
    const handleLogout = () => {
        logout();
    };

    // Navigate to the home page
    const home = () => {
        navigate("/");
    };

    // Navigate to the login page
    const handleLogin = () => {
        navigate("/login");
    };

    // Navigate to the register page
    const handleRegister = () => {
        navigate("/register");
    };

    // Tooltip to display the user role when hovering over the username
    const renderTooltip = (props) => (
        <Tooltip id="user-tooltip" {...props}>
            {userRole}
        </Tooltip>
    );

    return (
        <>
            {/* Navbar component with navigation links and user authentication options */}
            <Navbar bg="dark" variant="dark" expand="lg" style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
                <Container fluid>

                    {/* CineScope brand icon and name, clickable to navigate home */}
                    <Navbar.Brand onClick={home} style={{ color: "gold", cursor: "pointer" }}>
                        <FontAwesomeIcon icon={faVideoCamera} /> CineScope
                    </Navbar.Brand>

                    {/* Search Bar */}
                    <div className="mobile-search-bar ms-auto me-2">    {/* Visible only on tablet */}
                        <SearchBar />
                    </div>

                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        {/* Search Bar - Visible only below 530px */}
                        <div className="w-100 mb-2 d-lg-none mobile-search-only">
                            <SearchBar />
                        </div>

                        {/* Navigation links */}
                        <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: "100px" }} navbarScroll>
                            <NavLink className="nav-link" to="/">
                                <FontAwesomeIcon icon={faHouse} className="me-1" />
                                Home
                            </NavLink>
                            <NavLink className="nav-link" to="/watchlist">
                                <FontAwesomeIcon icon={faBookmark} className="me-1" />
                                Watch List
                            </NavLink>

                            {/* Render Manage Movies link only for Admin users */}
                            {userRole === 'Admin' && (
                                <NavLink className="nav-link" to="/manage">
                                    <FontAwesomeIcon icon={faEdit} className="me-1" />
                                    Manage Movies
                                </NavLink>
                            )}
                        </Nav>

                        {/* Search Bar - Visible on desktop */}
                        <div className="d-none d-lg-block me-3"> {/* Hidden on mobile */}
                            <SearchBar />
                        </div>

                        {/* Display user profile and logout buttons if authenticated, else display login and register buttons */}
                        <>
                            {isAuthenticated ? (
                                <>
                                    {/* Display user role in a tooltip */}
                                    <OverlayTrigger
                                        placement="bottom"
                                        delay={{ show: 250, hide: 250 }}
                                        overlay={renderTooltip}
                                    >
                                        <span className="fs-6 px-3 py-2 me-3" style={{ cursor: 'pointer' }}>
                                            <FontAwesomeIcon icon={faUser} className="px-2 me-1" />
                                            {user?.name || "User"}
                                        </span>
                                    </OverlayTrigger>

                                    {/* Logout button */}
                                    <Button variant="outline-info" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {/* Login and Register buttons when user is not authenticated */}
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
