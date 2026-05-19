import useTokenDecode from "../hooks/useTokenDecode";
import useChat from "../hooks/useChat";

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
        logout
    } = useChat(payload?.username);


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