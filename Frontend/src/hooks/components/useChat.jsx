import { useState, useEffect, useRef } from "react";
import useTokenDecode from "../useTokenDecode";
import {useFetchUsers, useFetchConnection, useFetchMessages} from "../useFetch";
import api from "../../api/axios";
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

        await api.post("/messages", {conn_id: connection[0].id, message, sender: current});
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


    //obesrve unseen messages + sent by other
    const {payload} = useTokenDecode();

    const observerRef = useRef(null);
    const messageRefs = useRef(new Map());
    const processingRef = useRef(new Set());

    const unseenMessages = messages?.filter(
        (msg) =>
            msg.sender !== payload?.username &&
            msg.status !== "seen"
    );

    useEffect(() => {
        if (!unseenMessages?.length) return;
        observerRef.current?.disconnect();

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(async (entry) => {
                if (!entry.isIntersecting) return;
                const messageId = entry.target.getAttribute("data-id"); //Get id from el for db
                if (processingRef.current.has(messageId)) return;
                processingRef.current.add(messageId);
                await api.patch("/messages/seen", { id: messageId });
                observerRef.current?.unobserve(entry.target);
            });
        });

        unseenMessages.forEach((msg) => {
            const el = messageRefs.current.get(msg.id); //Get el from id to observe
            if (el) {
                observerRef.current.observe(el);
            }
        });

        return () => {
            observerRef.current?.disconnect();
        };
    }, [unseenMessages]);

    
    // Listeners
    useEffect(() => {
        //Conn_id
        socket.on("new_message", message => {
            console.log(message);
            setMessages(prev => [message, ...(prev || [])]);
        });

        socket.on("typing", () => {
            setTyping(true);
        });

        socket.on("stop_typing", () => {
            setTyping(false);
        });

        socket.on("message_seen", (id) => {
            console.log("message_seen", id)
            setMessages(prev =>
                prev.map(message => (
                    message.id == id
                        ? { ...message, status: "seen" }
                        : message
                ))
            );
        });

        //Broadcast
        socket.on("online_users", (usernames) => {
            console.log(usernames);
            setUsers(prev =>
                prev.map(user =>
                    usernames.includes(user.username)
                        ? { ...user, status: "online" }
                        : { ...user, status: "offline" }
                )
            )
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

    //Add connection
    const [newContact, setNewContact] = useState("");
    const addContact = async (e) => {
        e.preventDefault();
        setNewContact("");

        await api.post("/connections", {current: payload.username, other: newContact});
    }

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
        messageRefs,
        newContact,
        setNewContact,
        addContact
    };
}