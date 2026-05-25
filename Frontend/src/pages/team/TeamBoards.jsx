import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useFetchTeamBoards } from "../../hooks/useFetch";

export default function TeamBoards({team, type}) {
    const {teamBoards, setTeamBoards} = useFetchTeamBoards({team, type});
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