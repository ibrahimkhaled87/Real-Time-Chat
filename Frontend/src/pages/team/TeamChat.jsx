import api from "../../api/axios";
import { useEffect, useState } from "react";
import useTokenDecode from "../../hooks/useTokenDecode";
import { socket } from "../../sockets/socket";

export default function TeamChat({team, onClose}) {
    const {payload} = useTokenDecode();
    useEffect(() => {
        socket.emit("join_team", team)
    }, [team])

    //Fetch team messages
    const [teamMessages, setTeamMessages] = useState(null);
    useEffect(() => {
        const getData = async() => {
            const response = await api.get("/teams/messages", {params: {team: team}})
            setTeamMessages(response.data);
        }
        getData();
    }, [team])

    //Send message
    const [message, setMessage] = useState();
    const sendMessage = async(e) => {
        e.preventDefault();
        try {
            const response = await api.post("/teams/messages", {team: team, message: message, sender: payload.username})
            setMessage("");
        } catch (error) {
            console.log(error);
        }
    }

    //Socket
    useEffect(() => {
        socket.on("team_message", message => {
            console.log("team_message");
            setTeamMessages(prev => [message, ...(prev || [])]);
        })

        return () => {
            socket.off("team_message");
        }
    }, [])
    
    return <div className="teamChat">
        <div className="top">
            <p className="close" onClick={onClose}>&larr;</p>
            <h2>Team #{team} Chat</h2>
        </div>
        <div className="messages">
            {teamMessages?.map(message => (
                <div className={`message ${message.sender===payload.username? "mine" : ""}`}>
                    <p>{message.sender}</p>
                    <div className="bubble">
                        <p>{message.message}</p>
                        <p>{new Date(message.sent_at).toLocaleTimeString()}</p>
                    </div>
                </div>
            ))}
        </div>
        <form onSubmit={sendMessage}>
            <input type="text" value={message} placeholder="Send message" onChange={(e) => setMessage(e.target.value)} />
            <button type="submit">Send</button>
        </form>
    </div>
}