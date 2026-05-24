import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function TeamBoards({team, type}) {
    //Fetch team boards
    const [teamBoards, setTeamBoards] = useState();
    useEffect(() => {
        const getData = async() => {
            try {
                const response = await axios.get("/teams/boards", {params: {team: team, type: type}});
                setTeamBoards(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        getData();
    }, [])

    const navigate = useNavigate();

    return <div className="teamBoards">
        <div className="top">
            <h2>Team #{team} {type} Boards</h2>
        </div>
        <div className="cards">
            <div className="card add">
                <p>+</p>
            </div>
            {teamBoards?.map(board => <div className="boardCard" onClick={() => navigate(`/team/${team}/board/${board.id}`)}>
                <img src="" alt="" />
                <div className="info">
                    <h4>{board.name}</h4>
                </div>
            </div>)}
        </div>
    </div>
}