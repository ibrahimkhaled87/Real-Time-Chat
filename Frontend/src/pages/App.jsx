import { useNavigate } from "react-router-dom";
import useTokenDecode from "../hooks/useTokenDecode";
import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../sockets/socket";

export default function App() {
    //Decode token
    const {payload} = useTokenDecode();

    //logout
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("token");
        socket.emit("offline", payload.username);
        navigate("/");
    }

    //Fetch users
    const [users, setUsers] = useState();
    useEffect(() => {
        if(!payload) return;

        const getData = async() => {
            try {
                const response = await axios.get("/users", {params: {current: payload.username} });
                setUsers(response.data);
            } catch (error) {
                console.log("error");
            }
        }
        getData();
    }, [payload])

    //Fetch connection
    const [connection, setConnection] = useState(null);
    const getConnection = async(other_user) => {
        try {
            const response = await axios.get("/connections", {params: {this_user: payload.username, other_user: other_user}})
            setConnection(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    //Fetch messages + join chat
    const [messages, setMessages] = useState(null);
    useEffect(() => {
        if(!connection) return;
        const getMessages = async () => {
            try {
                const response = await axios.get("/messages", {params: {conn_id: connection[0].id}})
                setMessages(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getMessages();

        socket.emit("join_chat", connection[0].id);
    }, [connection])

    //Send message + new_message event
    const [message, setMessage] = useState("");
    const sendMessage = async(e) => { //Form refresh
        if(message==="") return;
        e.preventDefault()

        try {
            const response = await axios.post("/messages", {conn_id: connection[0].id, message: message, sender: payload.username});
            socket.emit("new_message", {conn_id: connection[0].id, message:message, sender: payload.username});
            // alert(response.data);
        } catch (error) {
            console.log(error);
        }

        setMessage("");
    }

    //Recieve relevant events
    const [typing, setTyping] = useState(false);
    useEffect(() => {
        socket.on("message_received", message => { //Listener on must cleanup
            setMessages(prev => [message, ...(prev || [])]);
        });

        socket.on("typing", () => { //Listener on must cleanup
            console.log("TYPING");
            setTyping(true);
        });
        socket.on("stop_typing", () => { //Listener on must cleanup
            console.log("Stop Typing");
            setTyping(false);
        });

        socket.on("online", username => { //Listener on must cleanup
            console.log("Online");
            setUsers(prev =>
                prev.map(user =>
                    user.username === username
                        ? { ...user, status: "online" }
                        : user
                )
            );
        });

        socket.on("offline", username => { //Listener on must cleanup
            console.log("Offline");
            setUsers(prev =>
                prev.map(user =>
                    user.username === username
                        ? { ...user, status: "offline" }
                        : user
                )
            );
        });
        

        return () => {
            socket.off("message_received");
            socket.off("typing");
            socket.off("stop_typing");
            socket.off("online");
            socket.off("offline");
        }
    }, [])


    //Emit typing event
    useEffect(() => {
        if(!connection) return;

        if(message!=="") {
            socket.emit("typing", connection[0].id);
        }
        else {
            socket.emit("stop_typing", connection[0].id);
        }
    }, [message, connection])


    if(!payload) return <p>Loading...</p>

    return <div className="app">
        <div className="section left">
            {!users? <p>Loading...</p> : users.map(user => (
                <div className="user" onClick={() => getConnection(user.username)}>
                    <div className="picture">
                        <img src="/images/profile.svg" alt="" />
                        <div className={`status ${user.status==="online"? "online" : ""}`} ></div>
                    </div>
                    <p>{user.username}</p>
                </div>
            )) }

            <p onClick={logout} >Logout</p>
        </div>
        <div className="section right">
            {!connection? <p>Select user to chat</p> : <div className="connection">
                <div className="conn">
                    <p>Connection: {connection[0].id}</p> 
                    <p>{connection[0].user1===payload.username? connection[0].user2: connection[0].user1}</p>
                    <p>Is Typing? {typing.toString()}</p>
                </div>
                
                <div className="messagesArea">
                    {!messages? null : messages.map(message => (
                        <p className={`msg ${message.sender===payload.username? "mine" : ""}`} >{message.message}</p>
                    )) }
                </div>

                <form onSubmit={sendMessage}>
                    <input type="text" name="message" placeholder="Enter message" value={message} onChange={(e) => {setMessage(e.target.value)}} />
                    <button type="submit">Send</button>
                </form>
            </div> }
        </div>
    </div>
}