export function registerWhiteboard(io, socket) {
    socket.on("start_draw", ({x, y}) => {
        socket.broadcast.emit("start_draw", ({x, y}));
    })

    socket.on("draw", ({x, y}) => {
        socket.broadcast.emit("draw", ({x, y}));
    })

    socket.on("stop_draw", () => {
        socket.broadcast.emit("stop_draw");
    })

    socket.on("color", (color) => {
        socket.broadcast.emit("color", color);
    })
}