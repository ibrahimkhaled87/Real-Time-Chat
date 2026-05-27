import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import api from "../api/axios";

export default function Signup() {
    //Read form
    const [form, setForm] = useState({full_name: "", username: "", password: ""});
    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }
    //Send to backend
    const navigate = useNavigate();
    const signup = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/auth/signup", form);
            alert("Signup successful");
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }


    return <div className="signup">
        <div className="section right">
            <div className="desc">
                <h2>Create Account</h2>
            </div>

            <form onSubmit={signup}>
                <label htmlFor="full_name">Full Name</label>
                <input type="text" name="full_name" placeholder="Enter full name" required onChange={handleChange} />  
                <label htmlFor="username">Username</label>  
                <input type="text" name="username" placeholder="Enter username" required onChange={handleChange} />  
                <label htmlFor="password">Password</label>  
                <input type="password" name="password" placeholder="Enter password" required onChange={handleChange} /> 
                <button type="submit">Signup</button>  
                <div className="toggle">
                    <p>Already a member?</p> 
                    <p className="action" onClick={() => navigate("/")}>Login</p>
                </div>
            </form>
        </div>
    </div>
}