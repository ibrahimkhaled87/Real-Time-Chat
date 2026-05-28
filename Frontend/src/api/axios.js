import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_CLIENT_URL,
  withCredentials: true
});

export default api;