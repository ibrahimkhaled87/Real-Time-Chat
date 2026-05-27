import React from "react";
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AppLayout from "./layouts/AppLayout";
import Chat from "./pages/Chat";
import TicTacToe from "./pages/TicTacToe";
import Whiteboard from "./pages/Whiteboard";
import Team from "./pages/team/Team";
import TeamKanban from "./pages/team/TeamKanban";
import Cursor from "./pages/Cursor";

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
        path: "/whiteboard",
        element: 
        <ProtectedRoute>
            <Whiteboard />
        </ProtectedRoute>
    },
    {
        path: "/cursor",
        element: 
        <ProtectedRoute>
            <Cursor />
        </ProtectedRoute>
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
                element: <Chat />
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
                path: "/team/:teamId/kanban/:boardId",
                element: <TeamKanban />
            },
            {
                path: "/team/:teamId/whiteboard/:boardId",
                element: <Whiteboard />
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