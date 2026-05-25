import { useEffect, useState } from "react";
import useTokenDecode from "../useTokenDecode";
import { useFetchUsers, useFetchConnection } from "../useFetch";
import { socket } from "../../sockets/socket";

export default function useTicTacToe() {
    const {payload} = useTokenDecode();

    const {users} = useFetchUsers(payload?.username);
    const {connection, getConnection} = useFetchConnection(payload?.username);

    // ==== Board ====

    const [available, setAvailable] = useState(true);
    const [turn, setTurn] = useState("X");
    const [board, setBoard] = useState([
        "", "", "",
        "", "", "",
        "", "", ""
    ])
    
    const handleClick = (i) => {
        if(!available) return;

        if(board[i]==="") {
            setBoard(prev => ( //locally
                prev.map((item, idx) => (
                    idx===i
                    ? turn
                    : item
                ))
            ))
            setTurn(prev => prev === "X" ? "O" : "X");
            setAvailable(false);

            socket.emit("board_update", {conn_id: connection[0].id, i:i, value: turn}) //event
        }
    }

    // ==== Check win =====

    const [win, setWin] = useState(false);
    useEffect(() => {
        if(win)
            setAvailable(false);
    }, [win])

    const wins = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6]
    ]
    useEffect(() => {
        for(const [a, b, c] of wins) {
            if(
                board[a] &&
                board[a] === board[b] &&
                board[b] === board[c]
            ) {
                console.log(`${board[a]} WINNNN`)
                setWin(board[a]);
            }
        }
    }, [board])


    // ==== Check my char ====
    
    const [myChar, setMyChar] = useState(null);
    useEffect(() => {
        if(myChar) return;

        for(let i=0; i<9; i++)
            if(board[i]!=="") {
                if(available) setMyChar(turn);
                else setMyChar(turn==="X"? "O": "X");
                break;
            }
    }, [board])


    // ======= Socket ========

    // Emit join
    useEffect(() => {
        if(!connection) return;

        //Reset board
        setBoard(["", "", "", "", "", "", "", "", ""]);
        setAvailable(true);
        setTurn("X");
        setMyChar(null);

        socket.emit("join_game", {conn_id: connection[0].id, username: payload.username})

        const closeGame = () => {
            socket.emit("close_game", { conn_id: connection[0].id, username: payload.username });
        };
        window.addEventListener("pagehide", closeGame);
        window.addEventListener("beforeunload", closeGame);

        return () => {
            closeGame();
            window.removeEventListener("pagehide", closeGame);
            window.removeEventListener("beforeunload", closeGame);
        }
    }, [connection])


    // Listeners
    const [joined, setJoined] = useState("offline");
    useEffect(() => {
        socket.on("game_state", (state) => {
            console.log("GAME STATE", state);
            if(state.size===2)
                setJoined("available");
            else
                setJoined("offline");
        })

        socket.on("board_update", ({i, value}) => {
            console.log(i, value);
            setBoard(prev => (
                prev.map((item, idx) => (
                    idx===i
                    ? value
                    : item
                ))
            ))

            setTurn(prev => prev === "X" ? "O" : "X");

            setAvailable(true);
        })

        return () => {
            socket.off("game_state");
            socket.off("board_update");
        }
    }, [])


    // ==== Jsx calculations =====
    const mePlay = (myChar && available);
    const otherPlay = (myChar && !available);

    const otherUser = connection
        ? connection[0].user1 === payload.username
            ? connection[0].user2
            : connection[0].user1
        : null;

    const otherUserChar =
        myChar === "X"
            ? "O"
            : myChar === "O"
            ? "X"
            : null;


    return {users, connection, available, myChar, payload, joined, board, win, handleClick, getConnection, mePlay, otherPlay, otherUser, otherUserChar};
}