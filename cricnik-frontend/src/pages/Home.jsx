import { useEffect, useState } from "react";
import { recentMatches } from "../services/matchService";
import { useNavigate } from "react-router-dom";
import MatchCard from "../components/MatchCard";
import BottomNav from "../components/BottomNav";
import homeImg from "../assets/home.png";
import "./pages.css";

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 🔥 Fetch matches
  const fetchRecentMatches = async () => {
    try {
      setLoading(true);

      const res = await recentMatches();

      const data = res?.data || res || [];
      setMatches(data);

    } catch (error) {
      console.error("Error fetching matches:", error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Pre-warm backend + fetch data
  useEffect(() => {
    // wake backend (important for Render free tier)
    fetch("https://cricnik-backend-4g2a.onrender.com/api/health")
      .catch(() => {});

    fetchRecentMatches();
  }, []);

  return (
    <div className="home-page">

      {/* HERO */}
      <div
        className="home-hero"
        style={{ backgroundImage: `url(${homeImg})` }}
      >
        <h1 className="app-title">Cricnik</h1>
      </div>

      <div className="home-card">

        <h2 className="main-heading">Cricket Lives Here</h2>

        {/* ACTIONS */}
        <div className="action-list">

          <div
            className="action-item"
            onClick={() => navigate("/create-match")}
          >
            <span><i className="fa-solid fa-circle-plus"></i></span>
            <div>
              <h4>Create Match</h4>
              <p>Create a new cricket match</p>
            </div>
          </div>

          <div
            className="action-item"
            onClick={() => navigate("/create-team")}
          >
            <span><i className="fa-solid fa-user-group"></i></span>
            <div>
              <h4>Create Team</h4>
              <p>Create your cricket team</p>
            </div>
          </div>

        </div>

        {/* RECENT MATCHES */}
        <h3 className="recent-title">Recent Matches</h3>

        {loading ? (
          // 🔥 Better loading UI
          <div className="skeleton-wrapper">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
        ) : matches.length === 0 ? (
          <p className="no-matches">No recent matches</p>
        ) : (
          matches.map((m) => (
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