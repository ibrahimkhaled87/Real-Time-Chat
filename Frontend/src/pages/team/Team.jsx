import { useEffect, useState } from "react";
import TeamChat from "./TeamChat";
import useTokenDecode from "../../hooks/useTokenDecode";
import { socket } from "../../sockets/socket";
import TeamBoards from "./TeamBoards";
import {useFetchTeams} from "../../hooks/useFetch";
import Overlay from "../../components/Overlay";

export default function Team() {
    const {payload} = useTokenDecode();

    //Selected team
    const [selectedTeam, setSelectedTeam] = useState();
    const {teams, setTeams} = useFetchTeams(payload?.username);
    useEffect(() => {
        if(!teams) return;
        setSelectedTeam(teams[0].id);
    }, [teams])


    //Selected tab
    const [selectedTab, setSelectedTab] = useState(null);

    //Overlay?
    const [overlay, setOverlay] = useState(false);

    return <div className="team">
        <div className={`left ${selectedTab? "hide" : ""}`}>
            <h3>My Teams</h3>
            <select name="team" onChange={(e) => setSelectedTeam(e.target.value)}>
                {teams?.map(team => (
                    <option value={team.id}>{team.name}</option>
                ))}
            </select>
            <div className="buttons">
                <button className="create" onClick={()=>setOverlay("create team")}>+ Create Team</button>
                <button className="join" onClick={()=>setOverlay("join team")}>Request Team Join</button>
            </div>
            <ul className="team_features">
                <li onClick={() => setSelectedTab("messages")}>Team Chat</li>
                <li onClick={() => setSelectedTab("boards")}>Boards</li>
            </ul>
        </div>
        <div className={`right ${!selectedTab? "hide" : ""}`}>
            {!selectedTab
                ? <p>Select Tab</p> 
                : selectedTab==="messages"? <TeamChat team={selectedTeam} onClose={()=>setSelectedTab(null)} />
                : selectedTab==="boards"? <TeamBoards team={selectedTeam} onClose={()=>setSelectedTab(null)} />
                : null }
        </div>

        {/* Create team / Join team */}
        {overlay &&
            <Overlay info={overlay} onClose={()=>setOverlay(false)} />
        }
    </div>
}