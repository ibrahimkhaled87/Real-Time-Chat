import { useParams } from "react-router-dom";
import useTeamKanban from "../../hooks/components/useTeamKanban";
import { socket } from "../../sockets/socket";
import { useEffect } from "react";

export default function TeamKanban() {
    const {teamId, boardId} = useParams();

    const {
        form, 
        dragging, 
        setDragging, 
        handleChange, 
        mouseMove, 
        mouseUp, 
        handleDelete, 
        submit, 
        items, 
        remoteDragging, 
        position
    } = useTeamKanban({teamId, boardId});

    return <div className="teamKanban" onMouseUp={() => setDragging(null)} onMouseMove={mouseMove}>
        <h1>React Kanban Board</h1>
        <form onSubmit={submit} >
            <input type="text" name="task" value={form.task} onChange={handleChange} />
            <select name="type" onChange={handleChange}>
                <option value="to_do" defaultChecked>To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
            </select>
            <button type="submit">Add</button>
        </form>
        <div className="board">
            <div className="list to_do" onMouseUp={mouseUp}>
                <div className="header to_do">
                    <p>To Do</p>
                </div>
                <div className="items">
                    {items.filter(item => item.type==="to_do").map(item => (
                        <div className="item" onMouseDown={() => setDragging(item)}>
                            <p>{item.task}</p>
                            <p onClick={(e) => handleDelete(e, item.task)}>&times;</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="list in_progress" onMouseUp={mouseUp}>
                <div className="header in_progress">
                    <p>In Progress</p>
                </div>
                <div className="items">
                    {items.filter(item => item.type==="in_progress").map(item => (
                        <div className="item" onMouseDown={() => setDragging(item)}>
                            <p>{item.task}</p>
                            <p onClick={(e) => handleDelete(e, item.task)}>&times;</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="list done" onMouseUp={mouseUp}>
                <div className="header done">
                    <p>Done</p>
                </div>
                <div className="items">
                    {items.filter(item => item.type==="done").map(item => (
                        <div className="item" onMouseDown={() => setDragging(item)}>
                            <p>{item.task}</p>
                            <p onClick={(e) => handleDelete(e, item.task)}>&times;</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Dragging ghost */}
        {!(dragging || remoteDragging) ? null : <div className="dragged item" style={{
            left: position.x,
            top: position.y,
            userSelect: "none",
        }}>
            <p>{(dragging || remoteDragging).task}</p>
            <p>&times;</p>
        </div> }

        {/* Current team */}
        <div className="currentTeam">
            <p>Team 1</p>
        </div>

        {/* In room users */}
        <div className="roomMembers">
            <img src="/images/profile.svg" alt="" />
            <img src="/images/profile.svg" alt="" />
            <img src="/images/profile.svg" alt="" />
        </div>
    </div>
}