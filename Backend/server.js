import app from "./src/app.js";
import http from "http";
import { Server } from "socket.io";
import socketHandler from "./src/sockets/socketHandler.js";
const port = 5000;

const server = http.createServer(app); //Convert app to http server
const io = new Server(server, {     //Create socket.io server => attach to http server
    cors: {
        origin: [
            "http://localhost:3000",
            "https://real-time-chat-kohl-beta.vercel.app",
        ],
        credentials: true
    }
})
socketHandler(io); //Pass socket.io instance to logic 
app.set("io", io); //To use socket in controller

server.listen(port, () => {
    console.log(`Server running on port ${port}`)
});