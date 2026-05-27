import { io } from "socket.io-client";

export const socket = io(import.meta.env.REACT_APP_API_URL, {
    autoConnect: false
});