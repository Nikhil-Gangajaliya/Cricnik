import { useEffect, useState } from "react";
import {
    matchById,
    startMatch,
    startSecondInnings
} from "../services/matchService";
import { getScorecard } from "../services/scoreService";
import Scorecard from "../components/Scorecard";
import { api } from "../api/api";
import { useParams } from "react-router-dom";
import BottomNav from "../components/BottomNav";

export default function MatchView() {
    const { id } = useParams();

    const [match, setMatch] = useState(null);
    const [scorecard, setScorecard] = useState(null);

    const [striker, setStriker] = useState("");
    const [nonStriker, setNonStriker] = useState("");
    const [bowler, setBowler] = useState("");

    const [isWicketMode, setIsWicketMode] = useState(false);
    const [nextBatsman, setNextBatsman] = useState("");
    const [newBowler, setNewBowler] = useState("");

    const fetchMatch = async () => {
        try {
            const res = await matchById(id);
            setMatch(res.data?.data || res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchScorecard = async () => {
        try {
            const res = await getScorecard(id);
            setScorecard(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMatch();
    }, []);

    useEffect(() => {
        if (match?.status === "completed") {
            fetchScorecard();
        }
    }, [match]);

    if (!match) return <p>Loading...</p>;

    const innings =
        match.innings && match.innings.length > 0
            ? match.innings[match.innings.length - 1]
            : null;

    let needRuns = null;
    let oversLeft = null;

    if (innings?.target) {
        const runsLeft = innings.target - innings.totalRuns;

        const totalBalls = innings.maxOvers * 6;
        const ballsPlayed = innings.overs * 6 + innings.balls;
        const ballsRemaining = totalBalls - ballsPlayed;

        const o = Math.floor(ballsRemaining / 6);
        const b = ballsRemaining % 6;

        needRuns = runsLeft;
        oversLeft = `${o}.${b}`;
    }

    let battingTeam, bowlingTeam;

    if (!innings) {
        const tossWinner = String(match.tossWonBy);
        const teamAId = String(match.teamA._id);

        const isTeamAWinner = tossWinner === teamAId;

        if (match.electedTo === "bat") {
            battingTeam = isTeamAWinner ? match.teamA : match.teamB;
            bowlingTeam = isTeamAWinner ? match.teamB : match.teamA;
        } else {
            battingTeam = isTeamAWinner ? match.teamB : match.teamA;
            bowlingTeam = isTeamAWinner ? match.teamA : match.teamB;
        }
    } else {
        battingTeam = innings.battingTeam;
        bowlingTeam = innings.bowlingTeam;
    }

    const battingPlayers = (battingTeam?.players || []).filter(p => p && p._id);
    const bowlingPlayers = (bowlingTeam?.players || []).filter(p => p && p._id);

    const strikerId = String(innings?.striker?._id || "");
    const nonStrikerId = String(innings?.nonStriker?._id || "");

    const outPlayers = (innings?.outPlayers || []).map(p => String(p));

    const availableBatsmen = battingPlayers.filter(p => {
        const id = String(p._id);

        return (
            id !== strikerId &&
            id !== nonStrikerId &&
            !outPlayers.includes(id)
        );
    });

    const totalPlayers = battingPlayers.length;
    const wickets = innings?.wickets || 0;

    const remainingPlayers = totalPlayers - wickets - 2;

    const isLastWicket = remainingPlayers < 0;

    const lastBowlerId = String(innings?.lastOverBowler || "");

    const availableBowlers = bowlingPlayers.filter(p =>
        String(p._id) !== lastBowlerId
    )

    const isOverCompleted =
        innings?.balls === 0 &&
        innings?.overs > 0 &&
        String(innings?.currentBowler?._id || innings?.currentBowler) === lastBowlerId;

    const handleStart = async () => {
        if (!striker || !nonStriker || !bowler) {
            alert("Select all players");
            return;
        }

        await startMatch(id, {
            strikerId: striker,
            nonStrikerId: nonStriker,
            bowlerId: bowler
        });

        fetchMatch();
    };

    const handleSecondInnings = async () => {
        if (!striker || !nonStriker || !bowler) {
            alert("Select all players");
            return;
        }

        await startSecondInnings({
            matchId: match._id,
            strikerId: striker,
            nonStrikerId: nonStriker,
            bowlerId: bowler
        });

        fetchMatch();
    };

    const handleBall = async (runs, isWicket = false) => {

        if (!innings) return;
        if (!innings._id) return;

        if (isWicket && availableBatsmen.length > 0 && !nextBatsman) {
            alert("Please select next batsman");
            return;
        }

        await api.post("/scores/add-ball", {
            inningsId: innings._id,
            runs,
            isWicket,
            ...(isWicket && nextBatsman && { newBatsmanId: nextBatsman })
        });

        setIsWicketMode(false);
        setNextBatsman("");

        fetchMatch();
    };

    const handleExtra = async (type) => {
        await api.post("/scores/add-ball", {
            inningsId: innings?._id,
            runs: 1,
            isExtra: true,
            extraType: type
        });

        fetchMatch();
    };

    const handleBowlerChange = async () => {
        if (!newBowler) return;

        await api.post("/scores/change-bowler", {
            inningsId: innings?._id,
            newBowlerId: newBowler
        });

        setNewBowler("");
        fetchMatch();
    };

    let finalBattingPlayers = battingPlayers;
    let finalBowlingPlayers = bowlingPlayers;

    if (match.status === "break") {
        const firstInnings = match.innings?.[0];

        if (firstInnings) {
            const firstBattingTeamId = String(firstInnings.battingTeam._id);
            const teamAId = String(match.teamA._id);

            const isTeamABattedFirst = firstBattingTeamId === teamAId;

            const secondBattingTeam = isTeamABattedFirst
                ? match.teamB
                : match.teamA;

            const secondBowlingTeam = isTeamABattedFirst
                ? match.teamA
                : match.teamB;

            finalBattingPlayers = secondBattingTeam.players || [];
            finalBowlingPlayers = secondBowlingTeam.players || [];
        }
    }
    const winnerName = (() => {
        if (!match?.winner) return null;

        if (typeof match.winner === "string") {
            return match.winner;
        }

        if (match.teamA && String(match.winner) === String(match.teamA._id)) {
            return match.teamA.name;
        }

        if (match.teamB && String(match.winner) === String(match.teamB._id)) {
            return match.teamB.name;
        }

        return null;
    })();

    return (
        <div className="match-container">

            <div className="match-header">
                <h2 className="match-title">
                    {match.teamA?.name} vs {match.teamB?.name}
                </h2>

                <div className="match-details">
                    <div className="match-row">
                        <span className="icon"><i className="fa-solid fa-location-dot"></i></span>
                        <span>{match.venue || "N/A"}</span>
                    </div>

                    <div className="match-row">
                        <span className="icon"><i className="fa-solid fa-calendar"></i></span>
                        <span>
                            {match.date
                                ? new Date(match.date).toLocaleDateString("en-IN")
                                : "N/A"}
                        </span>
                    </div>

                    <div className="match-status">
                        <i className="fa-solid fa-circle-dot"></i>{match.status}
                    </div>
                </div>
            </div>

            {/* ================= UPCOMING ================= */}
            {match.status === "upcoming" && (
                <>
                    <h3>Select Players</h3>

                    <select className="select-box" onChange={(e) => setStriker(e.target.value)}>
                        <option value="">Striker</option>
                        {battingPlayers.map(p => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                    </select>

                    <select className="select-box" onChange={(e) => setNonStriker(e.target.value)}>
                        <option value="">Non-Striker</option>
                        {battingPlayers.map(p => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                    </select>

                    <select className="select-box" onChange={(e) => setBowler(e.target.value)}>
                        <option value="">Bowler</option>
                        {bowlingPlayers.map(p => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                    </select>

                    <button className="primary-btn" onClick={handleStart}>
                        Start Match
                    </button>
                </>
            )}

            {match.status === "live" && innings && (
                <>
                    {/* SCORE */}
                    <div className="score-box">
                        <div className="score">
                            {innings.totalRuns}/{innings.wickets}
                        </div>

                        <div className="overs">
                            Overs: {innings.overs}.{innings.balls}
                        </div>

                        {needRuns > 0 && (
                            <p style={{ color: "#f97316", marginTop: 5, fontWeight: "600", letterSpacing: "0.5px" }}>
                                Need {needRuns} runs in {oversLeft} overs
                            </p>
                        )}
                    </div>

                    {/* PLAYERS */}
                    <p className="player-info">Striker: {innings.striker?.name}</p>
                    <p className="player-info">Non-Striker: {innings.nonStriker?.name}</p>
                    <p className="player-info">Bowler: {innings.currentBowler?.name}</p>

                    {/* RUN BUTTONS */}
                    <div className="run-buttons">
                        {[0, 1, 2, 3, 4, 6].map(r => (
                            <button
                                key={r}
                                className="run-btn"
                                onClick={() => handleBall(r)}
                                disabled={isOverCompleted}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    {/* EXTRAS */}
                    <div className="extra-buttons">
                        <button className="extra-btn" onClick={() => handleExtra("wide")}>
                            Wide
                        </button>

                        <button className="extra-btn" onClick={() => handleExtra("no-ball")}>
                            No Ball
                        </button>
                    </div>

                    {/* WICKET */}
                    <button
                        className="wicket-btn"
                        onClick={() => {
                            if (availableBatsmen.length === 0) {
                                handleBall(0, true);
                            } else {
                                setIsWicketMode(true);
                            }
                        }}
                    >
                        Wicket
                    </button>

                    {/* NEW BATSMAN */}
                    {isWicketMode && availableBatsmen.length > 0 && (
                        <>
                            <select className="select-box" onChange={(e) => setNextBatsman(e.target.value)}>
                                <option value="">New Batsman</option>
                                {availableBatsmen.map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>

                            <button className="primary-btn" onClick={() => handleBall(0, true)}>
                                Confirm
                            </button>
                        </>
                    )}

                    {/* OVER COMPLETE */}
                    {isOverCompleted && (
                        <p style={{ color: "red", fontWeight: "bold" }}>
                            ⚠️ Over completed! Select new bowler
                        </p>
                    )}

                    {/* CHANGE BOWLER */}
                    {innings?.overs >= 1 && (
                        <>
                            <h4>Change Bowler</h4>

                            <select className="select-box" onChange={(e) => setNewBowler(e.target.value)}>
                                <option value="">Bowler</option>
                                {availableBowlers.map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>

                            <button className="primary-btn" onClick={handleBowlerChange}>
                                Change Bowler
                            </button>
                        </>
                    )}
                </>
            )}

            {/* ================= BREAK ================= */}
            {match.status === "break" && (
                <>
                    <h3>Start 2nd Innings</h3>

                    <select className="select-box" onChange={(e) => setStriker(e.target.value)}>
                        <option value="">Striker</option>
                        {finalBattingPlayers.map(p => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                    </select>

                    <select className="select-box" onChange={(e) => setNonStriker(e.target.value)}>
                        <option value="">Non-Striker</option>
                        {finalBattingPlayers.map(p => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                    </select>

                    <select className="select-box" onChange={(e) => setBowler(e.target.value)}>
                        <option value="">Bowler</option>
                        {finalBowlingPlayers.map(p => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                    </select>

                    <button className="primary-btn" onClick={handleSecondInnings}>
                        Start 2nd Innings
                    </button>
                </>
            )}

            {/* ================= COMPLETED ================= */}
            {match.status === "completed" && (
                <>

                    <h3 style={{ color: "#3fb3e7", fontWeight: "600", fontSize: "18px" }}>
                        {winnerName && match.result
                            ? `${winnerName} ${match.result}`
                            : match.result || "Result not available"}
                    </h3>

                    {scorecard && <Scorecard data={scorecard} />}
                </>
            )}
            <BottomNav />
        </div>
    );
}