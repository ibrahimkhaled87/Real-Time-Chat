import { useRef, useEffect, useState } from "react";
import useTokenDecode from "../hooks/useTokenDecode";
import useChat from "../hooks/chat/useChat";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import axios from "axios";

export default function App() {
    const {payload} = useTokenDecode();

    const {
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
    } = useChat(payload?.username);

    //obesrve unseen messages + sent by other
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

                const messageId = entry.target.getAttribute("data-id");

                if (processingRef.current.has(messageId)) return;
                
                processingRef.current.add(messageId);

                await axios.patch("/messages/seen", { id: messageId });

                observerRef.current?.unobserve(entry.target);
            });
        });

        unseenMessages.forEach((msg) => {
            const el = messageRefs.current.get(msg.id);

            if (el) {
                observerRef.current.observe(el);
            }
        });

        return () => {
            observerRef.current?.disconnect();
        };
    }, [unseenMessages]);



    if(!payload) return <p>Loading...</p>

    return <div className="app">
        <div className="section left" onClick={() => setConnection(null)}>
            <div className="entry">
                <h2>Chats</h2>
                <input type="text" placeholder="Search user"/>
            </div>

            <div className="users">
                {!users? <p>Loading...</p> : users.map(user => (
                    <div className="user" onClick={(e) => {e.stopPropagation(); getConnection(user.username)}}>
                        <div className="picture">
                            <img src="/images/profile.svg" alt="" />
                            <div className={`status ${user.status==="online"? "online" : ""}`} ></div>
                        </div>
                        <p>{user.username}</p>
                    </div>
                )) }
            </div>

            <p onClick={logout} >Logout</p>
        </div>
        <div className="section right">
            {!connection? <p>Select user to chat</p> : <div className="connection">
                <div className="conn">
                    <p>{connection[0].user1===payload.username? connection[0].user2: connection[0].user1}</p>
                    {!typing ? null :  <DotLottieReact src="images/typing.lottie" loop autoplay style={{width: "10em"}} /> }
                </div>
                
                <div className="messagesArea">
                    {messages?.map((message) => (
                        <div
                            key={message.id}
                            ref={(el) => {
                                if (el) {
                                    messageRefs.current.set(message.id, el);
                                }
                            }}
                            data-id={message.id}
                            className={`msg ${message.sender===payload.username ? "mine" : ""}`}
                        >
                            <p>{message.message}</p>
                            <p className="smaller">{new Date(message.sent_at).toLocaleTimeString()}</p>
                            <p className="smaller">{message.id}</p>
                            <p className="smaller">{message.status}</p>
                        </div>
                    ))}
                </div>

                <form onSubmit={sendMessage}>
                    <input type="text" name="message" placeholder="Enter message" value={message} onChange={(e) => {setMessage(e.target.value)}} />
                    <button type="submit">Send</button>
                </form>
            </div> }
        </div>
    </div>
}