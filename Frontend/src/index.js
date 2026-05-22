import React from "react";
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, routerProvider } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import App from "./pages/App";
import Kanban from "./pages/Kanban";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import TicTacToe from "./pages/TicTacToe";
import Whiteboard from "./pages/Whiteboard";

const router = createBrowserRouter([
    {
        path: "",
        element: 
        <PublicOnlyRoute>
            <Login />
        </PublicOnlyRoute>
    },
    {
        path: "/signup",
        element: 
        <PublicOnlyRoute>
            <Signup />
        </PublicOnlyRoute>
    },
    {
        path: "/app",
        element: 
        <ProtectedRoute>
            <App />
        </ProtectedRoute>
    },
    {
        path: "/kanban",
        element: 
        <ProtectedRoute>
            <Kanban />
        </ProtectedRoute>
    },
    {
        path: "/tic-tac-toe",
        element: 
        <ProtectedRoute>
            <TicTacToe />
        </ProtectedRoute>
    },
    {
        path: "/whiteboard",
        element: 
        <ProtectedRoute>
            <Whiteboard />
        </ProtectedRoute>
    },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)