import { useNavigate } from "react-router-dom";
import { socket } from "../../sockets/socket";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import useTokenDecode from "../useTokenDecode";

export default function useNav() {
    const {payload} = useTokenDecode();

    //Logout
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("token");
        socket.disconnect();
        navigate("/login");
    }

    //Notification
    const [notifications, setNotifications] = useState([]);
    const [show, setShow] = useState(false);
    useEffect(() => { //Fetch
        if(!payload) return;
        const getData = async() => {
            const response = await api.get("/users/notifications", {params: {user: payload?.username}})
            setNotifications(response.data);
        }
        getData();
    }, [payload])

    useEffect(() => { //Listen
        socket.on("notification", notification => {
            console.log(notification);
            setNotifications(prev => [...prev, notification])
        })

        return () => {
            socket.off("notification");
        }
    }, [])

    const acceptRequest = async (notification) => {
        //extract info
        const user = notification.match(/User (\w+)/)?.[1];
        const team = notification.match(/team (\d+)/)?.[1];
        
        //send to backend
        const response = await api.post("/teams/members", {user: user, team: team});
    }
    const rejectRequest = (notification) => {
        console.log(notification)
    }


    return {show, setShow, notifications, logout, rejectRequest, acceptRequest, navigate};
}