import React from "react";
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, routerProvider } from "react-router-dom";
import Login from "./pages/Login";
import App from "./pages/App";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";

const router = createBrowserRouter([
    {
        path: "",
        element: 
        <PublicOnlyRoute>
            <Login />
        </PublicOnlyRoute>
    },
    {
        path: "/app",
        element: 
        <ProtectedRoute>
            <App />
        </ProtectedRoute>
    },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)