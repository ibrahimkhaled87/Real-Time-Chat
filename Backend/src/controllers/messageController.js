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

    await db.query("INSERT INTO messages(conn_id, message, sender) VALUES ($1, $2, $3)", [conn_id, message, sender]);
    res.json("Message posted");
}