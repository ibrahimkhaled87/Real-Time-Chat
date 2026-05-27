import { useEffect, useRef } from "react";
import { socket } from "../sockets/socket";

export default function Cursor() {
    const elementRef = useRef(null);

    const current = useRef({ x: 0, y: 0 });
    const target = useRef({ x: 0, y: 0 });

    // send
    useEffect(() => {
        let lastEmit = 0;

        const handleMove = (e) => {
            const now = performance.now();

            if (now - lastEmit < 16) return;
            lastEmit = now;

            socket.volatile.emit("cursor", {
                x: e.clientX,
                y: e.clientY
            });
        };

        window.addEventListener("mousemove", handleMove);

        return () => {
            window.removeEventListener("mousemove", handleMove);
        };
    }, []);

    // receive
    useEffect(() => {
        const handleCursor = ({ x, y }) => {
            target.current.x = x;
            target.current.y = y;
        };

        socket.on("remote-cursor", handleCursor);

        return () => {
            socket.off("remote-cursor", handleCursor);
        };
    }, []);

    // animate
    useEffect(() => {
        let frame;
        let lastTime = performance.now();

        const animate = (time) => {
            const delta = time - lastTime;
            lastTime = time;

            // frame-rate independent smoothing
            const smoothing = 1 - Math.pow(0.001, delta / 1000);

            current.current.x +=
                (target.current.x - current.current.x) * smoothing;

            current.current.y +=
                (target.current.y - current.current.y) * smoothing;

            if (elementRef.current) {
                elementRef.current.style.transform =
                    `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
            }

            frame = requestAnimationFrame(animate);
        };

        frame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(frame);
    }, []);

    return <div className="cursor">
        <div
            ref={elementRef}
            className="element"
        />
    </div>
}