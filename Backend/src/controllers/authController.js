import db from "../config/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const login = async(req, res) => {
    console.log("POST login called");
    console.log(req.body);
    const {username, password} = req.body;

    // Does username exist?
    const data = await db.query("SELECT * FROM users WHERE username=$1", [username])
    if(data.rows.length===0)
        return res.status(400).json("Username doesn't exist");

    // Is password correct?
    const validPassword = (password === data.rows[0].password);
    if(!validPassword)
        return res.status(200).json("Incorrect password");

    const token = jwt.sign(
        { username: data.rows[0].username,
            f_name: data.rows[0].f_name,
            l_name: data.rows[0].l_name,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    res.json(token);
}