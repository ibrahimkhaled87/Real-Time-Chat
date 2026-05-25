import useTokenDecode from "../hooks/useTokenDecode";
import useChat from "../hooks/components/useChat";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useState } from "react";
import axios from "axios";

export default function Chat() {
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
        messageRefs,
        newContact,
        setNewContact,
        addContact
    } = useChat(payload?.username);


    if(!payload) return <p>Loading...</p>

    return <div className="chat">
        <div className="left">
            <div className="entry">
                <h3>My Contacts</h3>
                <form onSubmit={addContact}>
                    <input type="text" value={newContact} placeholder="username" onChange={(e) => setNewContact(e.target.value)}/>
                    <button type="submit">Add Contact</button>
                </form>
            </div>

            <div className="users">
                {!users? <p>Loading...</p> : users.map(user => (
                    <div 
                        className="user" 
                        onClick={(e) => {e.stopPropagation(); getConnection(user.username)}}
                        style={{backgroundColor: (connection?.[0]?.user1===user.username || connection?.[0]?.user2===user.username) && "lightgray"}}
                    >
                        <div className="picture">
                            <img src="/images/profile.svg" alt="" />
                            <div className={`status ${user.status}`} ></div>
                        </div>
                        <p>{user.full_name}</p>
                    </div>
                )) }
            </div>
        </div>
        <div className="right">
            {!connection? <p>Select user to chat</p> : <div className="connection">
                <div className="conn">
                    <p>{users.find(user => (user.username===connection[0].user1 || user.username===connection[0].user2)).full_name}</p>
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
                            {message.sender!==payload.username? null :
                                <p className="smaller" style={{
                                    fontSize: "0.6em",
                                    alignSelf:"end",
                                    color: message.status==="seen"? "skyblue": "gray"
                                }}>
                                    &#10004;&#10004;
                                </p>
                            }
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