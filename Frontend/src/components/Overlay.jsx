import axios from "axios";
import { useState } from "react";
import { createPortal } from "react-dom";
import useTokenDecode from "../hooks/useTokenDecode";
import { socket } from "../sockets/socket";

export default function Overlay({info, onClose, setTeamBoards}) {
  const {payload} = useTokenDecode();

  // New Team
  const [newTeam, setNewTeam] = useState("");
  const createTeam = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/teams", {name:newTeam, owner:payload.username})
      console.log(response.data);
      setNewTeam("");
      onClose();
    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
    }
  }

  // Request Team Join
  const [requested, setRequested] = useState();
  const requestTeam = (e) => {
      e.preventDefault();
      socket.emit("request_team_join", {user: payload.username, team: requested})
      onClose();
  }

  // New Board for team
  const [newBoard, setNewBoard] = useState({name:"", type:"kanban"});
  const handleChange = (e) => {
    const {name, value} = e.target;
    setNewBoard(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const createBoard = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/teams/boards", {...newBoard, team:info[1]})
      setTeamBoards(prev => ([...prev, response.data[0]]))
      setNewBoard("");
      onClose();
    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
    }
  }


  if(info==="create team")
    return createPortal(
      <div className="overlay" onClick={onClose}>
        <div className="modal" onClick={(e)=>e.stopPropagation()}>
          <h3>Create New Team</h3>
          <form onSubmit={createTeam}>
            <input type="text" name="name" value={newTeam} placeholder="Team name" onChange={(e)=>setNewTeam(e.target.value)} />
            <button>Create</button>
          </form>
        </div>
      </div>,
      document.body
    );

  else if(info==="join team")
    return createPortal(
      <div className="overlay" onClick={onClose}>
        <div className="modal" onClick={(e)=>e.stopPropagation()}>
          <h3>Request Team Join</h3>
          <form onSubmit={requestTeam}>
            <input type="text" name="id" value={requested} placeholder="Team id" onChange={(e)=>setRequested(e.target.value)} />
            <button>Request Team</button>
          </form>
        </div>
      </div>,
      document.body
    );

  else if(info[0]==="create board")
    return createPortal(
      <div className="overlay" onClick={onClose}>
        <div className="modal" onClick={(e)=>e.stopPropagation()}>
          <h3>Create Board</h3>
          <p>Team {info[1]}</p>
          <form onSubmit={createBoard}>
            <input type="text" name="name" value={newBoard.name} placeholder="Board name" onChange={handleChange} />
            <select name="type" onChange={handleChange}>
              <option value="kanban">Kanban</option>
              <option value="whiteboard">Whiteboard</option>
            </select>
            <button>Create Board</button>
          </form>
        </div>
      </div>,
      document.body
    );
}