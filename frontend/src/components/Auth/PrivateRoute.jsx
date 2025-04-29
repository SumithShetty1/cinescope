import { Navigate } from "react-router-dom";
import { useUser, useSession } from "@descope/react-sdk";

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
