const onlineUsers = new Map();

export function registerOnlineUsers(io, socket) {
    // Connect
    const username = socket.username;
    if (!onlineUsers.has(username)) {
        onlineUsers.set(username, new Set());
    }
    onlineUsers.get(username).add(socket.id);
    io.emit("online_users", [...onlineUsers.keys()]);
    socket.join(`user:${username}`);

    // Disconnect
    socket.on("disconnect", () => {
        const set = onlineUsers.get(username);
        if (set) {
            set.delete(socket.id);
            if (set.size === 0) onlineUsers.delete(username);
        }
        io.emit("online_users", [...onlineUsers.keys()]);
    });
}