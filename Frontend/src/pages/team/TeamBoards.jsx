import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useFetchTeamBoards } from "../../hooks/useFetch";
import Overlay from "../../components/Overlay";
import Message from "../../components/Message";

export default function TeamBoards({team}) {
    const {teamBoards, setTeamBoards} = useFetchTeamBoards({team});
    const navigate = useNavigate();

    const [overlay, setOverlay] = useState(false);
    const [message, setMessage] = useState(false);

    const deleteBoard = async (e, boardId) => {
        e.stopPropagation();
        try {
            await axios.delete(`/teams/boards/${boardId}`)
            setTeamBoards(prev => prev.filter(item => item.id!==boardId));
            setMessage({status: "success", info:"Deleted successfully"});
        } catch (error) {
            setMessage({status: "fail", info: "Couldn't delete board"});            
        }
    }

    return <div className="teamBoards">
        <div className="top">
            <h2>Team #{team} Boards</h2>
        </div>
        <div className="cards">
            <div className="card add" onClick={()=>setOverlay(["create board", team])}>
                <p>+</p>
            </div>
            {teamBoards?.map(board => 
            <div className="boardCard" 
                onClick={() => board.type==="kanban" 
                ? navigate(`/team/${team}/kanban/${board.id}`)
                : navigate(`/team/${team}/whiteboard/${board.id}`)
            }>
                <p className="delete" onClick={(e)=>deleteBoard(e, board.id)}>&times;</p>
                <img src="" alt="" />
                <div className="info">
                    <h4>{board.name}</h4>
                    <p>{board.type}</p>
                </div>
            </div>)}
        </div>

        {overlay &&
            <Overlay info={overlay} onClose={()=>setOverlay(false)} setTeamBoards={setTeamBoards} />
        }
        {message && 
            <Message status={message.status} info={message.info} onClose={()=>setMessage(false)} />    
        }
    </div>
}