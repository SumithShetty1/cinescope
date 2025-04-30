import { useSession, Descope } from "@descope/react-sdk";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// LoginPage handles user authentication using Descope and redirects authenticated users to the home page
const LoginPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSession();

    // Redirect already-logged-in users
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Descope
                flowId="sign-up-or-in"
                theme="dark"
                onSuccess={(e) => {
                    // console.log("Logged in:", e.detail.user);

                    // redirect to home or dashboard here
                    navigate("/");
                }}
                onError={(e) => {
                    console.error("Login failed:", e);
                }}
            />
        </div>
    );
};

export default LoginPage;
