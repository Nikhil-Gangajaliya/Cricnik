import { useState } from "react";
import { createPlayer } from "../services/teamService";

export default function AddPlayers({ teamId }) {
  const [name, setName] = useState("");

  const handleAdd = async () => {
    await createPlayer({ name, teamId });
    setName("");
  };

  return (
    <div>
      <h3>Add Players</h3>

      <input
        placeholder="Player Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={handleAdd}>Add Player</button>
    </div>
  );
}