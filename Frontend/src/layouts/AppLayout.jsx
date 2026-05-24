import { Outlet } from "react-router-dom";
import useNav from "../hooks/components/useNav";

export default function AppLayout() {    
    const {show, setShow, notifications, logout, rejectRequest, acceptRequest, navigate} = useNav();

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