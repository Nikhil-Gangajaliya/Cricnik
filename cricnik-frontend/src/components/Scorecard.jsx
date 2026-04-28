import "./components.css";

export default function Scorecard({ data }) {

  if (!data || !data.innings) {
    return <p className="no-data">No scorecard data</p>;
  }

  return (
    <div className="scorecard-container">

      <h2 className="scorecard-title">Scorecard</h2>

      {data.innings.map((inn, index) => (
        <div key={index} className="innings-card">

          <p className="innings-title">
            {index === 0 ? "1st Innings" : "2nd Innings"}
          </p>

          <h3 className="team-name">{inn.battingTeam}</h3>

          <h2 className="team-score">
            {inn.totalRuns}/{inn.wickets}
          </h2>

          <p className="team-overs">Overs: {inn.overs}</p>

          {/* ================= BATTING ================= */}
          <h4 className="section-title">Batting</h4>

          {inn.batting.filter(p => p.balls > 0 || p.runs > 0).length === 0 ? (
            <p className="no-data">No batting data</p>
          ) : (
            <table className="score-table">
              <thead>
                <tr>
                  <th>Batsman</th>
                  <th>Runs</th>
                  <th>Balls</th>
                  <th>4s</th>
                  <th>6s</th>
                </tr>
              </thead>
              <tbody>
                {inn.batting
                  .filter(p => p.balls > 0 || p.runs > 0)
                  .map((p, i) => (
                    <tr key={i}>
                      <td>{p.name}</td>
                      <td>{p.runs}</td>
                      <td>{p.balls}</td>
                      <td>{p.fours || 0}</td>
                      <td>{p.sixes || 0}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {/* ================= BOWLING ================= */}
          <h4 className="section-title">Bowling</h4>

          {!inn.bowling || inn.bowling.filter(p => p.balls > 0).length === 0 ? (
            <p className="no-data">No bowling data</p>
          ) : (
            <table className="score-table">
              <thead>
                <tr>
                  <th>Bowler</th>
                  <th>Overs</th>
                  <th>Runs</th>
                  <th>Wickets</th>
                </tr>
              </thead>
              <tbody>
                {inn.bowling
                  .filter(p => p.balls > 0)
                  .map((p, i) => {
                    const balls = p?.balls ?? 0;
                    const overs = Math.floor(balls / 6);
                    const remBalls = balls % 6;

                    return (
                      <tr key={p?._id || i}>
                        <td>{p?.name || "Unknown"}</td>
                        <td>{overs}.{remBalls}</td>
                        <td>{p?.runsConceded ?? 0}</td>
                        <td>{p?.wickets ?? 0}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}

        </div>
      ))}

    </div>
  );
}