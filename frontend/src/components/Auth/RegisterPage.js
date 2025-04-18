import { Descope } from "@descope/react-sdk";

const RegisterPage = () => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Descope
                flowId="sign-up"
                onSuccess={(e) => {
                    console.log("Registered:", e.detail.user);
                    // redirect to home or dashboard here
                }}
                onError={(e) => {
                    console.error("Registration failed:", e);
                }}
            />
        </div>
    );
};

export default RegisterPage;
