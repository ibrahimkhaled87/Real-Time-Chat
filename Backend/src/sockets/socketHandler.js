import db from "../config/db.js";

export default function socketHandler(io) {
    io.on("connection", socket => {
        console.log("Connected ", socket.id);

        socket.on("online", async(username) => {
            await db.query("UPDATE users SET status='online' WHERE username=$1", [username]);
            socket.broadcast.emit("online", username);
        })

        socket.on("offline", async(username) => {
            await db.query("UPDATE users SET status='offline' WHERE username=$1", [username]);
            socket.broadcast.emit("offline", username);
        })

        //Join socket to rooms
        // socket.on("setup", username => {
        //     socket.join(username);
        // })

        socket.on("join_chat", conn_id => {
            console.log("User join room");
            socket.join(conn_id);
        })
    
        //Event listener notify relevant rooms
        socket.on("new_message", message => {
            /* {conn_id, this_user, other_user, message} */
            console.log("New message");
            // socket.to(message.other_user).emit("new_notification", message);
            io.to(message.conn_id).emit("message_received", message);
        })
        
        socket.on("typing", (conn_id) => {
            console.log("typing");
            socket.to(conn_id).emit("typing");
        })
        socket.on("stop_typing", (conn_id) => {
            console.log("stop typing");
            socket.to(conn_id).emit("stop_typing");
        })
    })
}