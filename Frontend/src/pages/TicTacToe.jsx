import useFetchUsers from "../hooks/chat/useFetchUsers";
import useFetchConnection from "../hooks/chat/useFetchConnection";
import useTokenDecode from "../hooks/useTokenDecode";
import { useEffect, useState, useRef } from "react";
import { socket } from "../sockets/socket";

export default function TicTacToe() {
    const {payload} = useTokenDecode();

    const {users, setUsers} = useFetchUsers(payload?.username);
    const {connection, setConnection, getConnection} = useFetchConnection(payload?.username);

    const [turn, setTurn] = useState("X");
    const [board, setBoard] = useState([
        "", "", "",
        "", "", "",
        "", "", ""
    ])
    
    const handleClick = (i) => {
        if(board[i]==="") {
            setBoard(prev => (
                prev.map((item, idx) => (
                    idx===i
                    ? turn
                    : item
                ))
            ))

            if(turn==="X")
                setTurn("O")
            else 
                setTurn("X")
        }
    }

    // ======= Socket ========

    // Listen remote cursor
    const [remotePosition, setRemotePosition] = useState(null);
    useEffect(() => {
        socket.on("cursor", position => {
            setRemotePosition(position);
        });

        return () => socket.off("cursor");
    }, []);


    // Emit join
    useEffect(() => {
        if(!connection) return;

        socket.emit("join_game", connection[0].id)
    }, [connection])


    // Emit cursor
    const frame = useRef(null);
    const mouseMove = (e) => {
        if (!connection) return;

        const x = e.clientX;
        const y = e.clientY;
        
        if (frame.current) return;

        frame.current = requestAnimationFrame(() => {
            socket.emit("cursor", {
                conn_id: connection[0].id,
                position: { x, y }
            });
            frame.current = null;
        });
    };


    return <div className="ticTacToe" onMouseMove={mouseMove}>
        <div className="users">
            {!users? <p>Loading...</p> : users.map(user => (
                <div className="user" onClick={() => getConnection(user.username)}>
                    <img src="/images/profile.svg" alt="" />
                    <p>{user.username}</p>
                </div>
            )) }
        </div>

        <div className="area">
            {!connection? <p>Choose user to start game</p> : <div className="game">
                <div className="user other_user">
                    {connection[0].user1===payload.username? connection[0].user2 : connection[0].user1}
                    <p className="status">Offline</p>
                    <p>O</p>
                </div>
                <div className="board">
                    {board.map((item, i) => <div className={`cell ${i}`} onClick={() => handleClick(i)}>
                        {item}
                    </div> )}
                </div>
                <div className="user me">
                    {payload.username}
                    <p className="status">Available</p>
                    <p>X</p>
                </div>
            </div> }
        </div>

        {!remotePosition? null : <div className="remoteCursor" style={{
            top: remotePosition.y,
            left: remotePosition.x
        }}>
        {    
            connection?.[0]?.user1 === payload.username
            ? connection?.[0]?.user2
            : connection?.[0]?.user1
        }
        </div> }

    </div>
}