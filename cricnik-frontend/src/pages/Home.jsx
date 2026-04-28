import { useEffect, useState } from "react";
import { allMatches } from "../services/matchService";
import { useNavigate } from "react-router-dom";
import { getTeams } from "../services/teamService";
import { logoutUser } from "../services/authService";
import MatchCard from "../components/MatchCard";
import BottomNav from "../components/BottomNav";
import homeImg from "../assets/home.png";
import "./pages.css";

export default function Home() {
  const [openProfile, setOpenProfile] = useState(false);
  const [teams, setTeams] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const navigate = useNavigate();

  const fetchRecentMatches = async () => {
    try {
      const res = await allMatches();
      const matchesData =
        res?.data?.data ||
        res?.data ||
        res ||
        [];

      const sorted = matchesData
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);

      setRecentMatches(sorted);

    } catch (error) {
      console.error(error);
      setRecentMatches([]);
    }
  };

  useEffect(() => {
    fetchRecentMatches();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <div className="home-page">

      <div className="home-hero" style={{ backgroundImage: `url(${homeImg})` }}>

        <h1 className="app-title">Cricnik</h1>

      </div>

      <div className="home-card">

        <h2 className="main-heading">Cricket Lives Here</h2>

        <div className="action-list">

          <div className="action-item" onClick={() => navigate("/create-match")}>
            <span><i className="fa-solid fa-circle-plus"></i></span>
            <div>
              <h4>Create Match</h4>
              <p>Create a new cricket match</p>
            </div>
          </div>

          <div className="action-item" onClick={() => navigate("/create-team")}>
            <span><i className="fa-solid fa-user-group"></i></span>
            <div>
              <h4>Create Team</h4>
              <p>Create your cricket team</p>
            </div>
          </div>

        </div>

        <h3 className="recent-title">Recent Matches</h3>
        {recentMatches.length === 0 ? (
          <p className="no-matches">No recent matches</p>
        ) : (
          recentMatches.map((m) => (
            <MatchCard
              key={m._id}
              m={m}
              onClick={() => navigate(`/match/${m._id}`)}
            />
          ))
        )}

        <BottomNav />

      </div>



    </div>
  );
}