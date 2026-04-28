import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import "./pages.css";
import bgImage from "../assets/bg.png";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await api.post("/auth/signup", {
        username,
        email,
        password
      });

      // ✅ store token
      localStorage.setItem("token", res.data.data.accessToken);

      // ✅ direct login
      navigate("/home");

    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  return (
    <div className="signup-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="signup-container">
        <h2>Signup</h2>

        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSignup}>Signup</button>

        <p>
          Already have account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}