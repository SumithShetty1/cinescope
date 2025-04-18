import { Descope } from "@descope/react-sdk";

const LoginPage = () => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Descope
                flowId="sign-in"
                onSuccess={(e) => {
                    console.log("Logged in:", e.detail.user);
                    // redirect to home or dashboard here
                }}
                onError={(e) => {
                    console.error("Login failed:", e);
                }}
            />
        </div>
    );
};

export default LoginPage;
