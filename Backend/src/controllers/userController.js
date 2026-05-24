import db from "../config/db.js";

export const getUsers = async(req, res) => {
    console.log("GET users called");
    console.log(req.query);
    const {current} = req.query;

    const data = await db.query("SELECT * FROM users WHERE username != $1", [current]);
    res.json(data.rows);
}

export const getUserNotifications = async(req, res) => {
    console.log("GET user notifications called");
    console.log(req.query);
    const {user} = req.query;

    const data = await db.query("SELECT * FROM user_notifications WHERE username= $1", [user]);
    console.log(data.rows);
    res.json(data.rows); 
}