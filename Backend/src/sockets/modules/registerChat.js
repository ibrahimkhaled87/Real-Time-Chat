export function registerChat(io, socket) {
    socket.on("join_chat", (conn_id) => {
        socket.join(conn_id);
    });

    socket.on("typing", (conn_id) => {
        socket.to(conn_id).emit("typing");
    });

    socket.on("stop_typing", (conn_id) => {
        socket.to(conn_id).emit("stop_typing");
    });
}