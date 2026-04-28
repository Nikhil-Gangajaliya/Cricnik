import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getPlayersByTeam,
  createPlayer,
  updatePlayer,
  deletePlayer
} from "../services/teamService";
import "./pages.css";
import BottomNav from "../components/BottomNav";

export default function TeamView() {
  const { id } = useParams();

  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);


  const fetchPlayers = async () => {
    try {
      const data = await getPlayersByTeam(id);
      setPlayers(data || []);
    } catch (error) {
      console.error(error);
      setPlayers([]);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [id]);

  const handleAdd = async () => {
    if (!name.trim()) return;

    try {
      await createPlayer({
        name,
        teamId: id
      });

      setName("");
      fetchPlayers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (playerId) => {
    if (!editName.trim()) return;

    try {
      await updatePlayer(playerId, { name: editName });

      setEditingId(null);
      setEditName("");
      fetchPlayers();
    } catch (error) {
      console.error(error);
    }
  };

  const openDeleteModal = (playerId) => {
    setSelectedPlayerId(playerId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePlayer(selectedPlayerId);


      setPlayers((prev) =>
        prev.filter((p) => p._id !== selectedPlayerId)
      );

      setShowConfirm(false);
      setSelectedPlayerId(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="teamview-container">
      <h2 className="teamview-heading">Team Players</h2>

      {/* ➕ ADD PLAYER */}
      <div className="add-player-box">
        <input
          className="player-input"
          placeholder="Player name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="add-btn" onClick={handleAdd}>
          Add
        </button>
      </div>

      {/* PLAYER LIST */}
      {players.length === 0 ? (
        <p className="no-players">No Players Found</p>
      ) : (
        players.map((p) => (
          <div key={p._id} className="player-card">

            {editingId === p._id ? (
              <>
                <input
                  className="edit-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />

                <div className="player-actions">
                  <button
                    className="player-btn btn-save"
                    onClick={() => handleUpdate(p._id)}
                  >
                    Save
                  </button>

                  <button
                    className="player-btn btn-cancel"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="player-name">{p.name}</span>

                <div className="player-actions">
                  <button
                    className="player-btn btn-edit"
                    onClick={() => {
                      setEditingId(p._id);
                      setEditName(p.name);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="player-btn btn-delete"
                    onClick={() => openDeleteModal(p._id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}

          </div>
        ))
      )}

      {showConfirm && (
        <div className="teamview-modal-overlay">
          <div className="teamview-modal-box">
            <p>Delete this player?</p>

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