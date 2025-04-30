import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@descope/react-sdk";

// Read the Descope project ID from environment variables
const projectId = import.meta.env.VITE_DESCOPE_PROJECT_ID;

// Render the React application into the root DOM element
createRoot(document.getElementById("root")).render(
    <StrictMode>

        {/* Provide Descope authentication context to the entire app */}
        <AuthProvider projectId={projectId}>
            <BrowserRouter>

                {/* Define routing with a catch-all path that loads App component */}
                <Routes>
                    <Route path="/*" element={<App />} />
                </Routes>

            </BrowserRouter>
        </AuthProvider>

    </StrictMode>
);
