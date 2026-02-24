import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { playSound } from "../utils/sound";
import toast from "react-hot-toast";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/auth/login", { email, password });
            const { token } = res.data;
            localStorage.setItem("token", token);

            // play a short sound to enable notifications (user gesture already present)
            playSound("new-order.mp3");

            toast.success("Logged in");
            navigate("/owner");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Login failed");
        }
    };

    return (
        <div style={{maxWidth:400, margin:'40px auto'}}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
            <div style={{marginTop:12}}>
                <button onClick={() => playSound("new-order.mp3")}>Enable Notifications</button>
            </div>
        </div>
    );
}

export default Login;
