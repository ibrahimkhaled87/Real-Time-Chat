import db from "../../config/db.js";

export function registerTeam(io, socket) {
    socket.on("join_team", (teamId) => {
        socket.join(`team:${teamId}`);
    });

    socket.on("request_team_join", async ({ user, team }) => {
        const { rows } = await db.query(
            "SELECT owner FROM workspaces WHERE id=$1",
            [team]
        );

        const owner = rows[0].owner;

        const notification = await db.query(
            "INSERT INTO user_notifications(username, notification) VALUES($1, $2) RETURNING *",
            [owner, `User ${user} requests to join team ${team}`]
        );

        io.to(`user:${owner}`).emit("notification", notification.rows[0]);
    });

    socket.on("update_team_kanban", ({ updatedItems, team }) => {
        socket.to(`team:${team}`).emit("update_team_kanban", updatedItems);
    });
}