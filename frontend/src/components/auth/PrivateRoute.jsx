import { Navigate } from "react-router-dom";
import { useUser, useSession } from "@descope/react-sdk";

// PrivateRoute is a wrapper that ensures the user is authenticated and has the required role to access a route
// If not authenticated, it redirects to the login page
// If authenticated but lacks the required role, it redirects to the home page
const PrivateRoute = ({ children, requiredRole }) => {
    const { isAuthenticated } = useSession();
    const { user } = useUser();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const userRoles = user?.roleNames || '';
    if (requiredRole && !userRoles.includes(requiredRole)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;
