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