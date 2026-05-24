import db from "../config/db.js";

export const getConnections = async(req, res) => {
    console.log("GET connections called");
    console.log(req.query)
    const {this_user, other_user} = req.query;

    const data = await db.query(`SELECT * FROM connections 
    WHERE (user1=$1 OR user2=$1)
    AND (user1=$2 OR user2=$2)
    `, [this_user, other_user]);
    res.json(data.rows);
}

export const postConnection = async(req, res) => {
    console.log("POST connection called");
    console.log(req.body)
    const {current, other} = req.body;

    const data = await db.query("INSERT INTO connections(user1, user2) VALUES($1, $2)", [current, other]);

    const io = req.app.get("io");
    io.to(`user:${current}`).emit("notification", {notification: `Added user ${other}`});
    io.to(`user:${other}`).emit("notification", {notification: `User ${current} added you`});

    res.json(data.rows);
}