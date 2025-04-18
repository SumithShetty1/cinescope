import { Descope } from "@descope/react-sdk";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const navigate = useNavigate();

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Descope
                flowId="sign-up-or-in"
                theme="dark"
                onSuccess={(e) => {
                    console.log("Registered:", e.detail.user);
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
