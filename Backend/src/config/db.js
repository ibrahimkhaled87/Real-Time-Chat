import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const db = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})
db.connect()
    .then(() => console.log("DB connected"))
    .catch(err => console.log("DB connection error:", err));

export default db;