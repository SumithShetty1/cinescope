import { useSession, Descope } from "@descope/react-sdk";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// RegisterPage handles user registration using Descope and redirects authenticated users to the home page
const RegisterPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSession();

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
                    // console.log("Registered:", e.detail.user);

                    // redirect to home or dashboard here
                    navigate("/");
                }}
                onError={(e) => {
                    console.error("Registration failed:", e);
                }}
            />
        </div>
    );
};

export default RegisterPage;
