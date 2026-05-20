import { useState, useEffect } from "react";
import axios from "axios";
import { socket } from "../../sockets/socket";

export default function useFetchMessages(conn_id) {
    const [messages, setMessages] = useState(null);
    useEffect(() => {
        if(!conn_id) return;
        const getMessages = async () => {
            try {
                const response = await axios.get("/messages", {params: {conn_id: conn_id}})
                setMessages(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getMessages();

        socket.emit("join_chat", conn_id);
    }, [conn_id])

    return {messages, setMessages};
}