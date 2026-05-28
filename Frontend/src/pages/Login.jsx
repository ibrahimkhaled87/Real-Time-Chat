import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import api from "../api/axios";

export default function Login() {
    console.log(api.defaults.baseURL);
    console.log(process.env.REACT_APP_API_URL);
    
    //Read credintials
    const [credintials, setCredintials] = useState({username: "", password: ""});
    const handleChange = (e) => {
        const {name, value} = e.target;
        setCredintials(prev => ({
            ...prev,
            [name]: value
        }))
    }
    //Send to backend
    const navigate = useNavigate();
    const login = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/auth/login", credintials);
            alert("Login successful");
            localStorage.setItem("token", response.data);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }


    return <div className="login">
        <div className="section left">
            <DotLottieReact src="images/contact_us.lottie" loop autoplay />
        </div>
        <div className="section right">
            <div className="desc">
                <p>Welcome To</p>
                <h1>Real Time Chat</h1>
                <p>Stay connected to the people you love</p>
                <p>Chat, Collaborate.</p>
            </div>

            <form onSubmit={login}>
                <input type="text" name="username" placeholder="Enter username" onChange={handleChange} />    
                <input type="password" name="password" placeholder="Enter password" onChange={handleChange} /> 
                <button type="submit">Login</button>  
                <div className="toggle">
                    <p>Don't have an account?</p> 
                    <p className="action" onClick={() => navigate("/signup")}>Signup</p>
                </div>
            </form>
        </div>
    </div>
}