import { useEffect } from "react";
import { socket } from "../../sockets/socket";

export default function useSocketListeners({setMessages, setUsers, setTyping}) {
    useEffect(() => {
        //Conn_id
        socket.on("new_message", message => {
            setMessages(prev => [message, ...(prev || [])]);
        });

        socket.on("typing", () => {
            setTyping(true);
        });

        socket.on("stop_typing", () => {
            setTyping(false);
        });

        //Broadcast
        socket.on("online", username => {
            setUsers(prev =>
                prev.map(user =>
                    user.username === username
                        ? { ...user, status: "online" }
                        : user
                )
            );
        });

        socket.on("offline", username => {
            setUsers(prev =>
                prev.map(user =>
                    user.username === username
                        ? { ...user, status: "offline" }
                        : user
                )
            );
        });

        socket.on("clear_chat", () => {
            console.log("Clear")
            setMessages(null);
        });
        
        
        // Listeners on must cleanup
        return () => {
            socket.off("new_message");
            socket.off("typing");
            socket.off("stop_typing");
            socket.off("online");
            socket.off("offline");
            socket.off("clear_chat");
        }
    }, [setMessages, setUsers, setTyping])
}