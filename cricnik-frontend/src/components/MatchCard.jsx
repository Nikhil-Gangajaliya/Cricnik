import React from "react";

export default function MatchCard({
  m,
  onClick,
  showDelete = false,
  onDelete
}) {

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(m._id); // 👉 just call parent
  };;

  const isCompleted = !!m.winner;

  return (
    <div className="match-card">

      <div onClick={onClick}>

        <p className="match-time">
          {m.date
            ? new Date(m.date).toLocaleDateString("en-IN")
            : "No Date"}
        </p>

        <p className="match-venue">
          {m.venue || "Local Ground"}
        </p>

        {/* TEAM ROW */}
        <div className="team-row">

          {/* LEFT: TEAM NAMES */}
          <div className="team-left">
            <p className="team-name">{m.teamA?.name}</p>
            <p className="team-name">{m.teamB?.name}</p>
          </div>

          {/* RIGHT: SCORES */}
          <div className="team-right">
            <p className="team-score" style={{ fontSize: "18px" }}>
              {m.teamAScore || "--"}
              <span>
                {m.teamAOvers ? ` (${m.teamAOvers})` : ""}
              </span>
            </p>

            <p className="team-score" style={{ fontSize: "18px" }}>
              {m.teamBScore || "--"}
              <span>
                {m.teamBOvers ? ` (${m.teamBOvers})` : ""}
              </span>
            </p>
          </div>

        </div>

        {/* RESULT */}
        <p className={`match-result ${!isCompleted ? "pending" : ""}`}>
          {isCompleted
            ? `${m.winner} ${m.result?.toLowerCase()}`
            : "Match Not Completed"}
        </p>

      </div>

      {/* DELETE BUTTON */}
      {showDelete && (
        <button className="delete-btn" style={{ background: "#ef4444", color: "white", padding: "8px 12px", borderRadius: "8px", border: "none", fontSize: "13px", cursor: "pointer" }} onClick={handleDelete}>
          Delete Match
        </button>
      )}

    </div>
  );
}