import { useEffect, useState } from "react";
import { getTeams, deleteTeam, updateTeam } from "../services/teamService";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import "./pages.css";

export default function ViewTeams() {
  const [teams, setTeams] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  const navigate = useNavigate();

  const fetchTeams = async () => {
    try {
      const res = await getTeams();
      setTeams(res.data || res || []);
    } catch (err) {
      console.error(err);
      setTeams([]);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const openDeleteModal = (id) => {
    setSelectedTeamId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTeam(selectedTeamId);
      setTeams((prev) => prev.filter((t) => t._id !== selectedTeamId));

      setShowConfirm(false);
      setSelectedTeamId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await updateTeam(id, { name: newName });
      setEditingId(null);
      setNewName("");
      fetchTeams();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="teams-container">
      <h2 className="teams-heading">All Teams</h2>

      {teams.map((t) => (
        <div key={t._id} className="team-card">

          {editingId === t._id ? (
            <>
              <input
                className="team-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="New team name"
              />

              <div className="team-actions">
                <button className="team-btn btn-save" onClick={() => handleUpdate(t._id)}>
                  Save
                </button>

                <button className="team-btn btn-cancel" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h4 className="team-name">{t.name}</h4>

              <div className="team-actions">
                <button
                  className="team-btn btn-open"
                  onClick={() => navigate(`/team/${t._id}`)}
                >
                  Open
                </button>

                <button
                  className="team-btn btn-edit"
                  onClick={() => {
                    setEditingId(t._id);
                    setNewName(t.name);
                  }}
                >
                  Edit
                </button>

                <button
                  className="team-btn btn-delete"
                  onClick={() => openDeleteModal(t._id)}
                >
                  Delete
                </button>
              </div>
            </>
          )}

        </div>
      ))}
      {showConfirm && (
        <div className="teamview-modal-overlay">
          <div className="teamview-modal-box">
            <p>Delete this team?</p>

            <div className="teamview-modal-actions">
              <button
                className="teamview-cancel"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>

              <button
                className="teamview-delete"
                onClick={confirmDelete}
              >
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