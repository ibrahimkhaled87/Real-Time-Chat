import db from "../config/db.js";

export const getUsers = async(req, res) => {
    console.log("GET users called");
    console.log(req.query);
    const {current} = req.query;

    try {
        //Get users have connection with current
        const data = await db.query(`SELECT u.*
            FROM connections c
            JOIN users u
            ON u.username = CASE
                WHEN (c.user1 = $1) THEN c.user2
                ELSE c.user1
            END
            WHERE c.user1 = $1
            OR c.user2 = $1;`, [current]);
        res.json(data.rows);
    } catch(error) {
        res.status(500).json({ error: "DB failed" });
    }
}

export const getUserNotifications = async(req, res) => {
    console.log("GET user notifications called");
    console.log(req.query);
    const {user} = req.query;

    const data = await db.query("SELECT * FROM user_notifications WHERE username= $1", [user]);
    console.log(data.rows);
    res.json(data.rows); 
}