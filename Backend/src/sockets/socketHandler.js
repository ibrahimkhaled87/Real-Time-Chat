import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const onlineUsers = new Map();

export default function socketHandler(io) {
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if(!token) return next(new Error("No token"));

            const user = jwt.verify(token, process.env.JWT_SECRET);
            socket.username = user.username;

            next();
        } catch (error) {
            next(new Error("Unauthorized"));
        }
    })

    io.on("connection", socket => {
        const username = socket.username;
        console.log("Connected", username);

        if (!onlineUsers.has(username)) {
            onlineUsers.set(username, new Set());
        }
        onlineUsers.get(username).add(socket.id);
        io.emit("online_users", [...onlineUsers.keys()]);

        socket.on("disconnect", () => {
            console.log("Disconnected", username);

            const userSockets = onlineUsers.get(username);
            if (userSockets) {
                userSockets.delete(socket.id);

                if (userSockets.size === 0) {
                    onlineUsers.delete(username);
                }
            }
            io.emit("online_users", [...onlineUsers.keys()]);
        });


        // Chat
        socket.on("join_chat", conn_id => {
            socket.join(conn_id);
        })
        
        socket.on("typing", (conn_id) => {
            socket.to(conn_id).emit("typing");
        })
        
        socket.on("stop_typing", (conn_id) => {
            socket.to(conn_id).emit("stop_typing");
        })

        // Kanban
        socket.on("dragging", ({dragging, position}) => {
            console.log(socket.id, "dragging");
            socket.broadcast.emit("dragging", ({dragging, position}));
        })

        socket.on("stop_dragging", (items) => {
            console.log(socket.id, "stop_dragging");
            socket.broadcast.emit("stop_dragging", items);
        })

        socket.on("update_kanban", (items) => {
            console.log("update_kanban");
            socket.broadcast.emit("update_kanban", items);
        })

        // Tic tac toe
        socket.on("join_game", conn_id => {
            console.log("join game");
            socket.join(conn_id);
            socket.to(conn_id).emit("join_game");
        })

        socket.on("cursor", ({conn_id, position}) => {
            console.log(socket.id, "cursor");
            socket.to(conn_id).emit("cursor", position);
        })

        socket.on("board_update", ({conn_id, i, value}) => {
            console.log(socket.id, i, value);
            socket.to(conn_id).emit("board_update", ({i, value}));
        })

        // Whiteboard
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
    })
}