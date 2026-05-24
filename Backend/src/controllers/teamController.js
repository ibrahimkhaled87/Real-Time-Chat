import db from "../config/db.js";

// Teams
export const getTeams = async(req, res) => {
    console.log("GET teams called");
    console.log(req.query);
    const {user} = req.query;

    const data = await db.query(`SELECT DISTINCT w.id, w.name
        FROM workspaces w
        LEFT JOIN workspace_members wm 
        ON w.id = wm.workspace_id
        WHERE w.owner=$1
        OR wm.username=$1`, [user]);
    console.log(data.rows);
    res.json(data.rows);
}


// Team members
export const postTeamMember = async(req, res) => {
    console.log("POST team members called");
    console.log(req.body);
    const {user, team} = req.body;

    //insert member
    await db.query("INSERT INTO workspace_members(workspace_id, username, role) VALUES($1, $2, $3)", [team, user, "member"]);
    
    //notify member
    const notification = await db.query("INSERT INTO user_notifications(username, notification) VALUES($1, $2) RETURNING *", 
        [user, `Your request to join team ${team} has been accepted`]);

    const io = req.app.get("io");
    io.to(`user:${user}`).emit("notification", notification.rows[0]);
}


// Team messages
export const getTeamMessages = async (req, res) => {
    console.log("GET team messages");
    console.log(req.query);
    const {team} = req.query;

    const data = await db.query("SELECT * FROM workspace_messages WHERE workspace_id=$1 ORDER BY id DESC", [team]);
    res.json(data.rows);
}

export const postTeamMessage = async(req, res) => {
    console.log("POST team message");
    console.log(req.body);
    const {team, message, sender} = req.body;

    const data = await db.query("INSERT INTO workspace_messages(workspace_id, message, sender) VALUES($1, $2, $3) RETURNING *", [team, message, sender]);
    const io = req.app.get("io");
    io.to(`team:${team}`).emit("team_message", data.rows[0])
    res.json("Inserted message");
}



// Team boards
export const getTeamBoards = async (req, res) => {
    console.log("GET team kanbans");
    console.log(req.query);
    const {team, type} = req.query;

    const data = await db.query("SELECT * FROM workspace_boards WHERE workspace_id=$1 AND type=$2", [team, type]);
    res.json(data.rows);
}


//Team kanban
export const getTeamKanban = async (req, res) => {
    console.log("GET team kanban");
    console.log(req.params);
    const {id} = req.params;

    const data = await db.query("SELECT * FROM workspace_kanban WHERE board_id=$1", [id]);
    res.json(data.rows);
}

export const postTeamKanban = async (req, res) => {
    console.log("POST team kanban");
    console.log(req.params);
    const {id} = req.params;

    console.log(req.body);
    const {task, type} = req.body;

    const data = await db.query("INSERT INTO workspace_kanban(board_id, task, type) VALUES($1, $2, $3) RETURNING *", [id, task, type]);
    res.json("Inserted task");
}

export const patchTeamKanban = async (req, res) => {
    console.log("PATCH team kanban");
    console.log(req.params);
    const {id} = req.params;

    console.log(req.body);
    const {task, type} = req.body;

    const data = await db.query("UPDATE workspace_kanban SET type=$1 WHERE task=$2 AND board_id=$3 RETURNING *", [type, task, id]);
    res.json("Updated task");
}

export const deleteTeamKanban = async (req, res) => {
    console.log("DELETE team kanban");
    console.log(req.params);
    const {id} = req.params;

    console.log(req.body);
    const {task} = req.body;

    await db.query("DELETE FROM workspace_kanban WHERE task=$1 AND board_id=$2", [task, id]);
    res.json("Task deleted");
}