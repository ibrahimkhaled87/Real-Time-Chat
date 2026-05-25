import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function authMiddleware(socket, next) {
    try {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error("No token"));

        const user = jwt.verify(token, process.env.JWT_SECRET);
        socket.username = user.username;

        next();
    } catch {
        next(new Error("Unauthorized"));
    }
}