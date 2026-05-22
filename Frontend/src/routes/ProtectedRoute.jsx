import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { socket } from "../sockets/socket";

export default function ProtectedRoute({children}) {
    const token = localStorage.getItem("token");
    
    useEffect(() => {
        if(!token) return;

        socket.auth = {token};
        socket.connect();

        return () => socket.disconnect();
    }, [token]);

    return token ? children : <Navigate to="/" replace />;
}