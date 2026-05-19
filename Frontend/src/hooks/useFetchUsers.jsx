import { useState, useEffect } from "react";
import axios from "axios";

export default function useFetchUsers(current) {
    const [users, setUsers] = useState();
    useEffect(() => {
        if(!current) return;

        const getData = async() => {
            try {
                const response = await axios.get("/users", {params: {current: current} });
                setUsers(response.data);
            } catch (error) {
                console.log("error");
            }
        }
        getData();
    }, [current])

    return {users, setUsers};
}