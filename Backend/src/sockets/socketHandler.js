import { authMiddleware } from "./middleware/auth.js";
import { registerOnlineUsers } from "./modules/registerOnlineUsers.js";
import { registerChat } from "./modules/registerChat.js";
import { registerTicTacToe } from "./modules/registerTicTacToe.js";
import { registerWhiteboard } from "./modules/registerWhiteboard.js";
import { registerTeam } from "./modules/registerTeam.js";

export default function socketHandler(io) {
    io.use(authMiddleware);

    io.on("connection", socket => {
        registerOnlineUsers(io, socket);
        registerChat(io, socket);
        registerTicTacToe(io, socket);
        registerWhiteboard(io, socket);
        registerTeam(io, socket);

        socket.on("cursor", ({x, y}) => {
            console.log("Cursor", {x, y})
            socket.broadcast.volatile.emit("remote-cursor", ({x, y}));
        })
    })
}