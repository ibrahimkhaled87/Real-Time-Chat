export function registerTicTacToe(io, socket) {
    socket.on("join_game", ({conn_id}) => {
        console.log("JOIN GAME", conn_id)
        const roomName = `game:${conn_id}`;
        socket.join(roomName);

        const room = io.sockets.adapter.rooms.get(roomName);
        
        if(room?.size===2);
            io.to(roomName).emit("game_state", room.size);
    });

    socket.on("close_game", ({conn_id}) => {
        console.log("CLOSE GAME", conn_id);
        const roomName = `game:${conn_id}`;
        socket.leave(roomName);
                
        const room = io.sockets.adapter.rooms.get(roomName);
        
        if(room?.size===1);
            io.to(roomName).emit("game_state", room.size);
    })

    socket.on("board_update", ({ conn_id, i, value }) => {
        socket.to(`game:${conn_id}`).emit("board_update", { i, value });
    });
}