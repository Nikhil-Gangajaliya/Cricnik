import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import "./pages.css";
import bgImage from "../assets/bg.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setErrorMsg(""); 

      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.data.accessToken);

      navigate("/home");

    } catch (error) {
      console.error("Login failed", error);

      const message =
        error?.response?.data?.message || "Invalid email or password";

      setErrorMsg(message);
    }
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="login-container">
        <h1 className="login-title">Cricnik</h1>
        <h2>Login</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && <p className="error-text">{errorMsg}</p>}

        <button onClick={handleLogin}>Login</button>

        <p>
          No account?{" "}
          <span onClick={() => navigate("/signup")}>
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}