import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@descope/react-sdk";

const projectId = import.meta.env.VITE_DESCOPE_PROJECT_ID;

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider projectId={projectId}>
            <BrowserRouter>
                <Routes>
                    <Route path="/*" element={<App />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>
);
