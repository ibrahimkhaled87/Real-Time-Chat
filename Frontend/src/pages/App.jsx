import useTokenDecode from "../hooks/useTokenDecode";
import useChat from "../hooks/chat/useChat";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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