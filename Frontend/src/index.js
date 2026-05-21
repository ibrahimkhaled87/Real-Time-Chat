import React from "react";
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, routerProvider } from "react-router-dom";
import Login from "./pages/Login";
import App from "./pages/App";
import Kanban from "./pages/Kanban";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import TicTacToe from "./pages/TicTacToe";

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
    {
        path: "/kanban",
        element: <Kanban />
    },
    {
        path: "/tic-tac-toe",
        element: <TicTacToe />
    },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)