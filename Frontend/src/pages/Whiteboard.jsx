import { useRef, useState, useEffect } from "react"
import { socket } from "../sockets/socket";

export default function Whiteboard() {
    const canvasRef = useRef(null);

    const [drawing, setDrawing] = useState(false);

    // Canvas setup
    const [color, setColor] = useState("black");
    
    useEffect(() => {
        const canvas = canvasRef.current;

        // Set canvas size
        canvas.width = 800;
        canvas.height = 500;

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
        <h1>Whiteboard</h1>

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
        </div>
    </div>
}