import { useEffect, useState } from "react";
import axios from "axios";

export default function Kanban() {
    const [form, setForm] = useState({task: "", type: ""});
    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const submit = async(e) => {
        e.preventDefault();
        const response = await axios.post("/kanban", {task: form.task, type: form.type});
    }

    // =======
    
    const [items, setItems] = useState([
        {task: "Hello World", type: "to_do"},
        {task: "Buy Groceries", type: "to_do"},
    ])

    const [dragging, setDragging] = useState(null);
    useEffect(() => {
        console.log(dragging);
    }, [dragging])

    const mouseUp = (e) => {
        e.stopPropagation();
        const target = e.currentTarget.className;

        if(dragging) {
            if(target.includes("in_progress"))
                setItems(prev => (
                    prev.map(item => ( 
                        item === dragging
                        ? {...item, type: "in_progress"}
                        : item
                    ))
                ))

            else if(target.includes("done"))
                setItems(prev => (
                    prev.map(item => ( 
                        item === dragging
                        ? {...item, type: "done"}
                        : item
                    ))
                ))

            else if(target.includes("to_do"))
                setItems(prev => (
                    prev.map(item => ( 
                        item === dragging
                        ? {...item, type: "to_do"}
                        : item
                    ))
                ))

            setDragging(null);
        }

    }

    const globalMouseUp = () => {
        setDragging(null);
    }

    //mouse position
    const [position, setPosition] = useState({x: 0, y: 0});
    const mouseMove = (e) => {
        setPosition({
            x: e.clientX,
            y: e.clientY,
        })
    }

    // const divRefs = useRef([]);

    return <div className="kanban" onMouseUp={globalMouseUp} onMouseMove={mouseMove}>
        <h1>React Kanban Board</h1>
        <form onSubmit={submit} >
            <input type="text" name="task" onChange={handleChange} />
            <select name="type">
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
                            <p>&times;</p>
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
                            <p>&times;</p>
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
                            <p>&times;</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {!dragging ? null : <div className="dragged item" style={{
            left: position.x,
            top: position.y,
            userSelect: "none",
        }}>
            <p>{dragging.task}</p>
            <p>&times;</p>
        </div> }
    </div>
}