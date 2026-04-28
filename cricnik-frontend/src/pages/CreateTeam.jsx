import { useState } from "react";
import { createTeam } from "../services/teamService";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "./pages.css";

export default function CreateTeam() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    await createTeam({ name });
    navigate("/home");
  };

  return (
    <div className="create-match-page">

      <div className="create-card">
        <h2 className="create-title">Create Team</h2>

        <label>Team Name</label>
        <input
          className="input-box"
          placeholder="Enter team name"
          onChange={(e) => setName(e.target.value)}
        />

        <button className="create-btn" onClick={handleCreate}>
          Save Team
        </button>

      </div>
    <BottomNav />
    </div>
  );
}