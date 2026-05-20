import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetchUsers from "./useFetchUsers";
import useFetchConnection from "./useFetchConnection";
import useFetchMessages from "./useFetchMessages";
import useSocketListeners from "./useSocketListeners";
import axios from "axios";
import { socket } from "../../sockets/socket";

export default function useChat(current) {
    const { users, setUsers } = useFetchUsers(current);
    const { connection, setConnection, getConnection } = useFetchConnection(current);
    const { messages, setMessages } = useFetchMessages(connection?.[0]?.id);

    //New message
    const [message, setMessage] = useState("");
    const sendMessage = async (e) => {
        if (!message.trim()) return;
        e.preventDefault()

        await axios.post("/messages", {conn_id: connection[0].id, message, sender: current});
        socket.emit("new_message", {conn_id: connection[0].id, message, sender: current});
        setMessage("");
    };

    //Typing
    const [typing, setTyping] = useState(false);
    useEffect(() => {
        if(!connection) return;

        if(message.trim())
            socket.emit("typing", connection[0].id);
        else
            socket.emit("stop_typing", connection[0].id);
    }, [message, connection])

    //Logout
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("token");
        socket.emit("offline", current);
        navigate("/");
    }

    useSocketListeners({ setMessages, setUsers, setTyping });

    return {
        users,
        messages,
        message,
        setMessage,
        sendMessage,
        typing,
        connection,
        getConnection,
        setConnection,
        logout,
    };
}