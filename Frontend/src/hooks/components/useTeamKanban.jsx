import { useState, useEffect } from "react";
import api from "../../api/axios";
import { socket } from "../../sockets/socket";
import useTokenDecode from "../useTokenDecode";

export default function useTeamKanban({teamId, boardId}) {
    const {payload} = useTokenDecode();

    const [form, setForm] = useState({task: "", type: "to_do"});
    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    useEffect(() => {
        socket.emit("join_kanban", ({username:payload?.username, board:boardId}));
    }, [payload])

    // ====== ITEMS =======

    //Fetch items
    const [items, setItems] = useState([]);
    useEffect(() => {
        const getData = async() => {
            const response = await api.get(`/teams/kanban/${boardId}`);
            setItems(response.data);
        }
        getData();
    }, [])

    //Add item
    const submit = async(e) => {
        e.preventDefault();
        const updatedItems = [...items, form];
        
        setItems(updatedItems); //locally
        socket.emit("update_team_kanban", ({updatedItems, board:boardId})); //event
        await api.post(`/teams/kanban/${boardId}`, form); //db

        setForm(prev => ({
            ...prev,
            task: ""
        }))
    }

    //Delete item
    const handleDelete = async (e, task) => {
        e.stopPropagation();

        const updatedItems = items.filter(item => item.task !== task);
        setItems(updatedItems); //locally
        socket.emit("update_team_kanban", ({updatedItems, board:boardId})); //event
        await api.delete(`/teams/kanban/${boardId}`, {data: {task:task}}); //db
    }

    //Move item (stop dragging call)
    const moveItem = async(type) => {
        const updatedItems = items.map(item => (
            item === dragging
            ? {...item, type: type}
            : item
        ))
        setItems(updatedItems); //locally

        setDragging(null);
        socket.emit("stop_dragging", ({updatedItems, board:boardId})); //event
        
        await api.patch(`/teams/kanban/${boardId}`, {task: dragging.task, type: type}); //db
    }


    // ======= Dragging ========

    const [dragging, setDragging] = useState(null);

    const mouseUp = async (e) => {
        e.stopPropagation();
        const target = e.currentTarget.className;
        if(!dragging) return;

        if(target.includes("in_progress"))
            moveItem("in_progress");

        else if(target.includes("done"))
            moveItem("done");

        else if(target.includes("to_do"))
            moveItem("to_do");
    }

    const [position, setPosition] = useState({x: 0, y: 0});
    
    const mouseMove = (e) => {
        setPosition({
            x: e.clientX,
            y: e.clientY,
        })
    }

    // ====== Socket =======

    // Emit dragging event
    useEffect(() => {
        let interval;
        if(dragging) {
            interval = setInterval(() => {
                socket.volatile.emit("dragging", {dragging, position, board:boardId})
            }, 50);
        }

        return () => {
            clearInterval(interval);
        }
    }, [position, dragging])


    // Listen for dragging
    const [remoteDragging, setRemoteDragging] = useState(null);
    useEffect(() => {
        socket.on("dragging", ({dragging, position}) => {
            setRemoteDragging(dragging);
            setPosition(position)
        })
        socket.on("stop_dragging", items => {
            setItems(items);
            setRemoteDragging(null);
        })
        socket.on("update_team_kanban", updatedItems => {
            setItems(updatedItems);
        })
        socket.on("board_state", state=> {
            console.log(state);
        })

        return () => {
            socket.off("dragging");
            socket.off("stop_dragging");
            socket.off("update_team_kanban");
            socket.off("board_state");
        }
    }, [])

    return {form, dragging, setDragging, handleChange, mouseMove, mouseUp, handleDelete, submit, items, remoteDragging, position};
}