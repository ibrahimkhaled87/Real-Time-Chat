import { useEffect, useState } from "react";
import TeamChat from "./TeamChat";
import axios from "axios";
import useTokenDecode from "../../hooks/useTokenDecode";
import { socket } from "../../sockets/socket";
import TeamBoards from "./TeamBoards";
import {useFetchTeams} from "../../hooks/useFetch";

export default function Team() {
    const {payload} = useTokenDecode();

    //Selected team
    const [selectedTeam, setSelectedTeam] = useState();
    const {teams, setTeams} = useFetchTeams(payload?.username);

    //Selected tab
    const [selectedTab, setSelectedTab] = useState(null);

    //Request team join
    const [requested, setRequested] = useState();
    const requestTeamJoin = (e) => {
        e.preventDefault();
        socket.emit("request_team_join", {user: payload.username, team: requested})
    }

    return <div className="team">
        <div className="left">
            <h2>My Teams</h2>
            <select name="team" onChange={(e) => setSelectedTeam(e.target.value)}>
                {teams?.map(team => (
                    <option value={team.id}>{team.name}</option>
                ))}
            </select>
            <form onSubmit={requestTeamJoin}>
                <input type="text" placeholder="Team id" onChange={(e) => setRequested(e.target.value)}/>
                <button type="submit">Request Team Join</button>
            </form>
            <ul className="team_features">
                <li onClick={() => setSelectedTab("messages")}>Team Chat</li>
                <li onClick={() => setSelectedTab("kanban")}>Kanban Boards</li>
            </ul>
        </div>
        <div className="right">
            {!selectedTab
                ? <p>Select Tab</p> 
                : selectedTab==="messages"? <TeamChat team={selectedTeam} />
                : selectedTab==="kanban"? <TeamBoards team={selectedTeam} type="kanban" />
                : null }
        </div>
    </div>
}