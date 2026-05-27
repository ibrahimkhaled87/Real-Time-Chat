import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../sockets/socket";

// Users
export function useFetchUsers(current) {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        if(!current) return;

        const getData = async() => {
            try {
                const response = await axios.get("/users", {params: {current: current} });
                setUsers(response.data);
            } catch (error) {
                console.log("error");
            }
        }
        getData();
    }, [current])

    return {users, setUsers};
}

// Messages
export function useFetchMessages(conn_id) {
    const [messages, setMessages] = useState(null);
    useEffect(() => {
        if(!conn_id) return;
        const getMessages = async () => {
            try {
                const response = await axios.get("/messages", {params: {conn_id: conn_id}})
                setMessages(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getMessages();

        socket.emit("join_chat", conn_id);
    }, [conn_id])

    return {messages, setMessages};
}

export function useFetchAllMessages(current) {
    const [allMessages, setAllMessages] = useState([]);
    useEffect(() => {
        if(!current) return;
        const getAllMessages = async () => {
            try {
                const response = await axios.get("/messages", {params: {current: current}});
                setAllMessages(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getAllMessages();
    }, [current])

    return {allMessages, setAllMessages};
}

// Connections
export function useFetchConnection(current) {
    const [connection, setConnection] = useState(null);
    const getConnection = async(other_user) => {
        try {
            const response = await axios.get("/connections", {params: {this_user: current, other_user: other_user}})
            setConnection(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    return {connection, setConnection, getConnection};
}

// Teams
export function useFetchTeams(user) {
    const [teams, setTeams] = useState();
    useEffect(() => {
        if(!user) return;
        const getData = async() => {
            try {
                const response = await axios.get("/teams", {params: {user: user}});
                setTeams(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getData();
    }, [user])

    return {teams, setTeams};
}

// Team boards
export function useFetchTeamBoards({team}) {
    const [teamBoards, setTeamBoards] = useState();
    useEffect(() => {
        const getData = async() => {
            try {
                const response = await axios.get("/teams/boards", {params: {team: team}});
                setTeamBoards(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getData();
    }, [team])

    return {teamBoards, setTeamBoards};
}