const games = new Map();

export function registerTicTacToe(io, socket) {
    socket.on("join_game", ({conn_id, username}) => {
        console.log("JOIN GAME", conn_id, username)
        const roomName = `game:${conn_id}`;
        socket.join(roomName);

        // Room set in map
        if (!games.has(roomName)) games.set(roomName, new Set());
        const room = games.get(roomName);
        
        // User already may exist
        if (room.has(username)) return;
        room.add(username);
        
        io.to(roomName).emit("game_state", {size: room.size, players:[...room]});
    });

    socket.on("close_game", ({conn_id, username}) => {
        console.log("CLOSE GAME", conn_id, username);
        const roomName = `game:${conn_id}`;
        socket.leave(roomName);
            
        // Room set in map
        const room = games.get(roomName);
        if (!room) return;

        // User already not exist
        if (!room.has(username)) return;
        room.delete(username);

        // cleanup empty room
        if (room.size === 0) {
            games.delete(roomName);
        }

        io.to(roomName).emit("game_state", {size: room.size, players:[...room]}); //only people inside room notified
    })

    socket.on("board_update", ({ conn_id, i, value }) => {
        socket.to(`game:${conn_id}`).emit("board_update", { i, value });
    });
}