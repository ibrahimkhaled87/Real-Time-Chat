import db from "../config/db.js";

export const getKanban = async(req, res) => {
    console.log("GET kanban called");

    const data = await db.query("SELECT * FROM kanban ORDER BY id");
    res.json(data.rows);
}

export const postKanban = async(req, res) => {
    console.log("POST kanban called");
    console.log(req.body);
    const {task, type} = req.body;

    await db.query("INSERT INTO kanban(task, type) VALUES ($1, $2)", [task, type]);
    res.json("Inserted");
}

export const patchKanban = async(req, res) => {
    console.log("PATCH kanban called");
    console.log(req.body);
    const {task, type} = req.body;

    await db.query("UPDATE kanban SET type=$1 WHERE task=$2", [type, task]);
    res.json("Updated");
}

export const deleteKanban = async(req, res) => {
    console.log("DELETE kanban called");
    console.log(req.body);
    const {task} = req.body;

    await db.query("DELETE FROM kanban WHERE task=$1", [task]);
    res.json("Deleted");
}