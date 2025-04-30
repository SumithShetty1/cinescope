import React from 'react';
import { Link } from "react-router-dom";
import './NotFound.css';

// NotFound component displays a 404 error page when a user navigates to a route that does not exist
const NotFound = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1 className="not-found-title">404</h1>
                <h2 className="not-found-subtitle">Page Not Found</h2>
                <p className="not-found-message">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className="not-found-button">
                    Return Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
