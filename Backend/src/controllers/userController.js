import db from "../config/db.js";

export const getUsers = async(req, res) => {
    console.log("GET users called");
    console.log(req.query);
    const {current} = req.query;

    const data = await db.query("SELECT * FROM users WHERE username != $1", [current]);
    res.json(data.rows);
}