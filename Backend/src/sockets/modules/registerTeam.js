import db from "../../config/db.js";

const boards = new Map();

export function registerTeam(io, socket) {
    // Register Chat
    socket.on("join_team", (teamId) => {
        socket.join(`team:${teamId}`);
    });

    // Register Board
    // Presence
    socket.on("join_board", ({username, board}) => {
        const roomName = `board:${board}`;
        socket.join(roomName);

        // Room set in map
        if (!boards.has(roomName)) boards.set(roomName, new Set());
        const room = boards.get(roomName);
        
        // User already may exist
        if (room.has(username)) return;
        room.add(username);
        
        io.to(roomName).emit("board_state", {size: room.size, users:[...room]});
    })
    socket.on("close_board", ({username, board}) => {
        console.log("CLOSE BOARD", board, username);
        const roomName = `board:${board}`;
        socket.leave(roomName);
            
        // Room set in map
        const room = boards.get(roomName);
        if (!room) return;

        // User already not exist
        if (!room.has(username)) return;
        room.delete(username);

        // cleanup empty room
        if (room.size === 0) {
            boards.delete(roomName);
        }

        io.to(roomName).emit("board_state", {size: room.size, users:[...room]}); //only people inside room notified
    })
    socket.on("disconnect", () => {
        for (const [roomName, room] of boards) {
            // remove user from this board
            room.delete(socket.username);

            // cleanup empty board
            if (room.size === 0) {
                boards.delete(roomName);
                continue;
            }

            // notify remaining users
            io.to(roomName).emit("board_state", {
                size: room.size,
                users: [...room]
            });
        }
    })



    socket.on("request_team_join", async ({ user, team }) => {
        const { rows } = await db.query(
            "SELECT owner FROM workspaces WHERE id=$1",
            [team]
        );

        const owner = rows[0].owner;

        const notification = await db.query(
            "INSERT INTO user_notifications(username, notification) VALUES($1, $2) RETURNING *",
            [owner, `User ${user} requests to join team ${team}`]
        );

        io.to(`user:${owner}`).emit("notification", notification.rows[0]);
    });

    socket.on("dragging", ({ dragging, position, board }) => {
        socket.to(`board:${board}`).emit("dragging", ({dragging, position}));
    });
    socket.on("stop_dragging", ({ updatedItems, board }) => {
        socket.to(`board:${board}`).emit("stop_dragging", updatedItems);
    });
    socket.on("update_team_kanban", ({ updatedItems, board }) => {
        socket.to(`board:${board}`).emit("update_team_kanban", updatedItems);
    });
}