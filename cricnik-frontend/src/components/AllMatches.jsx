import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allMatches, deleteMatch } from "../services/matchService";
import MatchCard from "../components/MatchCard";
import BottomNav from "../components/BottomNav";

function AllMatches() {
  const [matches, setMatches] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const fetchMatches = async () => {
    try {
      const res = await allMatches();

      const matchesData =
        res?.data?.data ||
        res?.data ||
        res ||
        [];

      setMatches(matchesData);
    } catch (error) {
      console.error(error);
      setMatches([]);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteMatch(id);

      setMatches((prev) => prev.filter((m) => m._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete match");
    }
  };

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteMatch(selectedId);

      setMatches((prev) => prev.filter((m) => m._id !== selectedId));
      setShowConfirm(false);
    } catch (error) {
      console.error(error);
      alert("Failed to delete match");
    }
  };

  return (
    <div className="all-matches-container">
      <h3 className="all-matches-heading">All Matches</h3>

      {matches.length === 0 ? (
        <p className="no-matches">No matches available</p>
      ) : (
        matches.map((m) => (
          <MatchCard
            key={m._id}
            m={m}
            onClick={() => navigate(`/match/${m._id}`)}
            showDelete={true}         
            onDelete={openDeleteModal}
          />
        ))
      )}

      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>Delete this match?</p>

            <div className="modal-actions">
              <button onClick={() => setShowConfirm(false)}>
                Cancel
              </button>

              <button className="danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}

export default AllMatches;