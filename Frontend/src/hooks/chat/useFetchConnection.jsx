import { useState } from "react";
import axios from "axios";

export default function useFetchConnection(current) {
    const [connection, setConnection] = useState(null);
    const getConnection = async(other_user) => {
        try {
            const response = await axios.get("/connections", {params: {this_user: current, other_user: other_user}})
            setConnection(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    return {connection, setConnection, getConnection};
}