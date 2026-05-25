import { useRef, useState, useEffect } from "react"
import { socket } from "../sockets/socket";

export default function Whiteboard() {
    const canvasRef = useRef(null);

    const [drawing, setDrawing] = useState(false);

    // Canvas setup
    const [color, setColor] = useState("black");
    
    useEffect(() => {
        const canvas = canvasRef.current;

        // Get display size
        const rect = canvas.getBoundingClientRect();

        // Set actual pixel resolution
        canvas.width = rect.width;
        canvas.height = rect.height;

        const ctx = canvas.getContext("2d");

        // Drawing style
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.strokeStyle = color;
    }, []);

    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.strokeStyle = color;

        socket.emit("color", color);
    }, [color])

    
    // Canvas draw
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


    // Canvas notes
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



    // Socket listen
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
            <div className="color blue" onClick={() => setColor("blue")}></div>
            <div className="color red" onClick={() => setColor("red")}></div>
            <div className="color green" onClick={() => setColor("green")}></div>

            <button onClick={addSticky}>
                + Sticky Note
            </button>
        </div>


        {notes.map(note => (
            <div
                key={note.id}
                className="sticky"
                contentEditable
                suppressContentEditableWarning
                style={{
                    position: "absolute",
                    left: note.x,
                    top: note.y,
                    width: 150,
                    minHeight: 100,
                    background: "yellow",
                    padding: 10,
                    borderRadius: 8,
                    cursor: "move"
                }}
                onInput={(e) => {
                    const updatedText = e.currentTarget.innerText;

                    setNotes(prev =>
                        prev.map(n =>
                            n.id === note.id ? { ...n, text: updatedText } : n
                        )
                    );

                    socket.emit("update_note", {
                        id: note.id,
                        text: updatedText
                    });
                }}
                onMouseDown={(e) => {
                    const startX = e.clientX;
                    const startY = e.clientY;

                    const move = (ev) => {
                        dragNote(ev, note.id);
                    };

                    window.addEventListener("mousemove", move);
                    window.addEventListener("mouseup", () => {
                        window.removeEventListener("mousemove", move);
                    }, { once: true });
                }}
            >
                {note.text}
            </div>
        ))}
    </div>
}