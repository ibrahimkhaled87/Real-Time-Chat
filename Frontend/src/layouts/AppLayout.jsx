import { Outlet, useNavigate } from "react-router-dom";
import { socket } from "../sockets/socket";
import { useEffect, useState } from "react";
import axios from "axios";
import useTokenDecode from "../hooks/useTokenDecode";

export default function AppLayout() {    
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
            const response = await axios.get("/users/notifications", {params: {user: payload?.username}})
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
        const response = await axios.post("/teams/members", {user: user, team: team});
    }
    const rejectRequest = (notification) => {
        console.log(notification)
    }


    return <div className="appLayout">
        <div className="main-nav">
            <h1>ReallY</h1>
            <ul>
                <li onClick={() => navigate("/")}><img src="/images/messages.svg" alt="" /></li>
                <li onClick={() => navigate("/game")}><img src="/images/game.svg" alt="" /></li>
                <li onClick={() => navigate("/team")}><img src="/images/team.svg" alt="" /></li>
            </ul>
            <div className="user">
                <div className="notifications">
                    <div className="bell" onClick={() => setShow(!show)}>
                        <img className="notification" src="/images/notification.svg" alt="" />
                        <p className="count">{notifications?.length}</p>
                    </div>
                    <div className={`content ${show? "show" : ""}`}>
                        {notifications?.map(notification => (
                            <div className="notification">
                                <p>{notification.notification}</p>
                                <p>{notification.received_at}</p>
                                <div className="actions">
                                    <button className="reject" onClick={()=>rejectRequest(notification.notification)}>Reject</button>
                                    <button className="accept" onClick={()=>acceptRequest(notification.notification)}>Accept</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <img src="/images/logout.svg" alt="" onClick={logout}/>
            </div>
        </div>

        <Outlet />
    </div>
}