import { useEffect, useState } from "react";
import { createMatch } from "../services/matchService";
import { getTeams } from "../services/teamService";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "./pages.css";

export default function CreateMatch() {
  const [teams, setTeams] = useState([]);

  const [data, setData] = useState({
    teamA: "",
    teamB: "",
    tossWonBy: "",
    electedTo: "bat",
    maxOvers: 2,
    venue: "",
    date: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    getTeams().then(res => setTeams(res.data || res));
  }, []);

  return (
    <div className="create-match-page">

      <div className="create-card">
        <h2 className="create-title">Create Match</h2>

        {/* TEAM 1 */}
        <label>Team A</label>
        <select
          className="input-box"
          onChange={(e) => setData({ ...data, teamA: e.target.value })}
        >
          <option value="">Select Team 1</option>
          {teams.map(t => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>

        {/* TEAM 2 */}
        <label>Team B</label>
        <select
          className="input-box"
          onChange={(e) => setData({ ...data, teamB: e.target.value })}
        >
          <option value="">Select Team 2</option>
          {teams.map(t => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>

        {/* TOSS */}
        <label>Toss Winner</label>
        <select
          className="input-box"
          onChange={(e) =>
            setData({ ...data, tossWonBy: e.target.value })
          }
        >
          <option value="">Select Toss Winner</option>

          {teams
            .filter(t => t._id === data.teamA || t._id === data.teamB)
            .map(t => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
        </select>

        {/* BAT / BOWL */}
        <label>Decision</label>
        <select
          className="input-box"
          onChange={(e) => setData({ ...data, electedTo: e.target.value })}
        >
          <option value="bat">Bat</option>
          <option value="bowl">Bowl</option>
        </select>

        {/* OVERS */}
        <label>Overs</label>
        <input
          className="input-box"
          type="number"
          placeholder="Enter overs"
          onChange={(e) => setData({ ...data, maxOvers: e.target.value })}
        />

        {/* DATE */}
        <label>Date</label>
        <input
          className="input-box"
          type="date"
          value={data.date}
          onChange={(e) => setData({ ...data, date: e.target.value })}
        />

        {/* VENUE */}
        <label>Venue</label>
        <input
          className="input-box"
          placeholder="Enter venue"
          value={data.venue}
          onChange={(e) => setData({ ...data, venue: e.target.value })}
        />

        {/* BUTTON */}
        <button
          className="create-btn"
          onClick={async () => {
            try {
              const res = await createMatch(data);

              const matchId = res.data?._id;

              if (!matchId) {
                alert("Match creation failed");
                return;
              }

              navigate(`/match/${matchId}`);
            } catch (err) {
              console.error(err);
              alert("Error creating match");
            }
          }}
        >
          Start Match
        </button>

      </div>
      <BottomNav />
    </div>
  );
}