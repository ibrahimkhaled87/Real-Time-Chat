import { useRef, useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import { socket } from "../sockets/socket";
import useTokenDecode from "../hooks/useTokenDecode";

export default function Whiteboard() {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);

    // Socket Emit
    const {payload} = useTokenDecode();
    const {boardId} = useParams();
    useEffect(() => {
        if(!payload) return;

        socket.emit("join_board", {username: payload?.username, board: boardId})

        const closeBoard = () => {
            socket.emit("close_board", {username:payload?.username, board: boardId});
        };
        window.addEventListener("pagehide", closeBoard);
        window.addEventListener("beforeunload", closeBoard);

        return () => {
            closeBoard();
            window.removeEventListener("pagehide", closeBoard);
            window.removeEventListener("beforeunload", closeBoard);
        }
    }, [payload])


    // Canvas Setup
    const [color, setColor] = useState("black");
    useEffect(() => {
        const canvas = canvasRef.current;

        const rect = canvas.getBoundingClientRect();

        // Set actual pixel resolution
        canvas.width = rect.width;
        canvas.height = rect.height;

        const ctx = canvas.getContext("2d");

        // Drawing style
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.imageSmoothingEnabled = true;
        ctx.strokeStyle = color;
    }, []);

    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.strokeStyle = color;

        socket.emit("color", color);
    }, [color])


    // Canvas Draw
    const startDraw = (e) => {
        setDrawing(true);

        const ctx = canvasRef.current.getContext("2d");

        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    
        socket.emit("start_draw", {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY})
    };
    const draw = (e) => {
        if (!drawing) return;

        const ctx = canvasRef.current.getContext("2d");

        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();

        socket.emit("draw", {x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY})
    };
    const stopDraw = () => {
        setDrawing(false);

        socket.emit("stop_draw");
    };


    // Canvas Notes
    const [notes, setNotes] = useState([]);
    const addSticky = () => {
        const newNote = {
            id: Date.now(),
            x: 100,
            y: 100,
            text: "New note"
        };
        setNotes(prev => [...prev, newNote]);
    };
    const dragNote = (e, id) => {
        const x = e.clientX;
        const y = e.clientY;

        setNotes(prev =>
            prev.map(note =>
                note.id === id
                    ? { ...note, x, y }
                    : note
            )
        );
    };
    const stickyMouseDown = (e, note) => {
        if (e.target !== e.currentTarget) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        const move = (ev) => {
            setNotes(prev =>
                prev.map(n =>
                    n.id === note.id
                        ? {
                            ...n,
                            x: ev.clientX - offsetX,
                            y: ev.clientY - offsetY
                        }
                        : n
                )
            );
        };

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", () => {
            window.removeEventListener("mousemove", move);
        }, { once: true });
    };
    const stickyInput = (e, note) => {
        const updatedText = e.currentTarget.innerText;
        setNotes(prev =>
            prev.map(n =>
                n.id === note.id ? { ...n, text: updatedText } : n
            )
        );
    }

    // Canvas Texts
    const [texts, setTexts] = useState([]);
    const addText = () => {
        const newText = {
            id: Date.now(),
            x: 100,
            y: 100,
            text: "New text"
        };
        setTexts(prev => [...prev, newText]);
    };
    const dragText = (e, id) => {
        const x = e.clientX;
        const y = e.clientY;

        setTexts(prev =>
            prev.map(text =>
                text.id === id
                    ? { ...text, x, y }
                    : text
            )
        );
    };
    const textMouseDown = (e, text) => {
        if (e.target !== e.currentTarget) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        const move = (ev) => {
            setTexts(prev =>
                prev.map(n =>
                    n.id === text.id
                        ? {
                            ...n,
                            x: ev.clientX - offsetX,
                            y: ev.clientY - offsetY
                        }
                        : n
                )
            );
        };

        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", () => {
            window.removeEventListener("mousemove", move);
        }, { once: true });
    };
    const textInput = (e, text) => {
        const updatedText = e.currentTarget.innerText;
        setTexts(prev =>
            prev.map(n =>
                n.id === text.id ? { ...n, text: updatedText } : n
            )
        );
    }


    // Socket Listen
    const [presence, setPresence] = useState();
    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");

        socket.on("start_draw", ({ x, y }) => {
            ctx.beginPath();
            ctx.moveTo(x, y);
        });

        socket.on("draw", ({ x, y }) => {
            ctx.lineTo(x, y);
            ctx.stroke();
        });

        socket.on("stop_draw", () => {
            ctx.closePath();
        })

        socket.on("color", (color) => {
            setColor(color);
        })

        socket.on("board_state", state => {
            console.log(state);
            setPresence(state.users);
        })

        return () => {
            socket.off("start_draw");
            socket.off("draw");
            socket.off("stop_draw");
            socket.off("color");
        };
    }, []);


    return <div className="whiteboard">
        <canvas 
            ref={canvasRef} 
            onMouseDown={startDraw} 
            onMouseMove={draw} 
            onMouseUp={stopDraw}
            style={{
                border: "1px solid lightgray"
            }}
        />

        <div className="toolset">
            <img src="/images/whiteboard/pen.svg" alt="" />
            <img src="/images/whiteboard/text.svg" alt="" onClick={addText}/>
            <img src="/images/whiteboard/sticky.svg" alt="" onClick={addSticky} />
            <img src="/images/whiteboard/shapes.svg" alt="" />
            <img src="/images/whiteboard/lines.svg" alt="" />
            <img src="/images/whiteboard/cursor.svg" alt="" />
        </div>

        {/* Sticky */}
        {notes.map(note => (
            <div
                key={note.id}
                className="sticky"
                contentEditable
                suppressContentEditableWarning
                style={{
                    left: note.x,
                    top: note.y,
                }}
                onBlur={(e) => stickyInput(e, note)}
                onMouseDown={(e)=>stickyMouseDown(e, note)}
            >
                {note.text}
            </div>
        ))}

        {/* Text */}
        {texts.map(text => (
            <div
                key={text.id}
                className="text"
                contentEditable
                suppressContentEditableWarning
                style={{
                    left: text.x,
                    top: text.y,
                }}
                onBlur={(e) => textInput(e, text)}
                onMouseDown={(e)=>textMouseDown(e, text)}
            >
                {text.text}
            </div>
        ))}

        {/* Team Info */}
        <div className="currentTeam">
            <p>Team 1</p>
        </div>
        <div className="roomMembers">
            {presence?.map(user =>
                <div className="member">
                    <img src="/images/profile.svg" alt="" />
                    <p className="message">{user}</p>
                </div>  
            )}
        </div>
    </div>
}