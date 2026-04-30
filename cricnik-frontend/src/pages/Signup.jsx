import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import "./pages.css";
import bgImage from "../assets/bg.png";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await api.post("/auth/signup", {
        username,
        email,
        password,
      });

      // ✅ store token
      localStorage.setItem("token", res.data.data.accessToken);

      // ✅ small delay (1.5 sec) before redirect
      setTimeout(() => {
        navigate("/home");
      }, 1500);

    } catch (error) {
      const message =
        error?.response?.data?.message || "Signup failed";

      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="signup-page"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="signup-container">
        <h1 className="login-title">Cricnik</h1>
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

        {errorMsg && <p className="error-text">{errorMsg}</p>}

        <button onClick={handleSignup} disabled={loading}>
          {loading ? "Creating account..." : "Signup"}
        </button>

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