import React from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import "./ToastNotification.css";

// Displays a temporary message to notify the user about actions/events
const ToastNotification = ({ toast, setToast }) => {
    return (
        <ToastContainer
            position="top-end"
            className="p-3 toast-container-custom"
            style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: 9999,
            }}
        >
            <Toast
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
                delay={3000}
                autohide
                bg={toast.variant}
                className="custom-toast"
            >
                <Toast.Body className="text-white">
                    {toast.message}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
};

export default ToastNotification;
