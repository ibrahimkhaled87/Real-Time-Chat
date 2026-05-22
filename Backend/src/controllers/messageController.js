import db from "../config/db.js";

export const getMessages = async(req, res) => {
    console.log("GET messages called");
    console.log(req.query);
    const {conn_id} = req.query;

    const data = await db.query("SELECT * FROM messages WHERE conn_id=$1 ORDER BY id DESC", [conn_id]);
    res.json(data.rows);
}

export const postMessage = async(req, res) => {
    console.log("POST messages called");
    console.log(req.body);
    const {conn_id, message, sender} = req.body;

    const date = new Date().toLocaleString();
    const insertedMessage = await db.query("INSERT INTO messages(conn_id, message, sender, sent_at) VALUES ($1, $2, $3, $4) RETURNING *", [conn_id, message, sender, date]);
    
    const io = req.app.get("io");
    io.to(conn_id).emit("new_message", insertedMessage.rows[0]);

    res.json("Message posted");
}

export const patchMessageSeen = async(req, res) => {
    console.log("PATCH message seen called");
    console.log(req.body);
    const {id} = req.body;

    const insertedMessage = await db.query("UPDATE messages SET status='seen' WHERE id=$1 RETURNING *", [id]);
    
    const io = req.app.get("io");
    io.to(insertedMessage.rows[0].conn_id).emit("message_seen", id);

    res.json("Message updated seen");
}