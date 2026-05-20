import db from "../config/db.js";

export default function socketHandler(io) {
    io.on("connection", socket => {
        console.log("Connected ", socket.id);

        //Setup
        socket.on("join_chat", conn_id => {
            socket.join(conn_id);
        })

        //Events
        socket.on("online", async(username) => {
            await db.query("UPDATE users SET status='online' WHERE username=$1", [username]);
            socket.broadcast.emit("online", username);
        })

        socket.on("offline", async(username) => {
            await db.query("UPDATE users SET status='offline' WHERE username=$1", [username]);
            socket.broadcast.emit("offline", username);
        })
    
        socket.on("new_message", message => {
            io.to(message.conn_id).emit("new_message", message);
        })
        
        socket.on("typing", (conn_id) => {
            socket.to(conn_id).emit("typing");
        })
        
        socket.on("stop_typing", (conn_id) => {
            socket.to(conn_id).emit("stop_typing");
        })

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
    })
}