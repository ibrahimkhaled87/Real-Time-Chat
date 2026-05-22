import db from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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
    const validPassword = await bcrypt.compare(password, data.rows[0].password);
    if(!validPassword)
        return res.status(400).json("Incorrect password");

    const token = jwt.sign(
        { username: data.rows[0].username,
            full_name: data.rows[0].full_name,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    res.json(token);
}

export const signup = async(req, res) => {
    console.log("POST signup called");
    console.log(req.body);
    const {full_name, username, password} = req.body;

    //Does username exist?
    const data = await db.query("SELECT * FROM users WHERE username=$1", [username]);
    if(data.rows.length!==0)
        return res.status(400).json("Username already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users(full_name, username, password) VALUES ($1, $2, $3)", [full_name, username, hashedPassword]);
    res.json("Registered successfully");
}