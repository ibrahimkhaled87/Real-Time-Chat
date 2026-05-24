import React from "react";
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import App from "./pages/App";
import Kanban from "./pages/Kanban";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import TicTacToe from "./pages/TicTacToe";
import Whiteboard from "./pages/Whiteboard";
import AppLayout from "./layouts/AppLayout";
import Team from "./pages/Team";
import TeamKanban from "./pages/team/TeamKanban";

const router = createBrowserRouter([
    {
        path: "/login",
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
        path: "",
        element: 
        <ProtectedRoute>
            <AppLayout />
        </ProtectedRoute>, 
        children: [
            {
                path: "",
                element: <App />
            },
            {
                path: "game",
                element: <TicTacToe />
            },
            {
                path: "team",
                element: <Team />
            },
            {
                path: "/team/:teamId/board/:boardId",
                element: <TeamKanban />
            }
        ]
    }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)