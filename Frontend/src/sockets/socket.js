import { io } from "socket.io-client";

export const socket = io(process.env.REACT_APP_CLIENT_URL, {
    autoConnect: false,
    withCredentials: true,
});