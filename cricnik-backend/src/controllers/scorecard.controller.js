import { Match } from "../models/match.model.js";
import { Innings } from "../models/innings.model.js";
import { PlayerStats } from "../models/playerStats.model.js";
import { Ball } from "../models/ball.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getScorecard = asyncHandler(async (req, res) => {
    const { matchId } = req.params;

    const match = await Match.findById(matchId)
        .populate("teamA teamB");

    if (!match) {
        throw new ApiError(404, "Match not found");
    }

    const inningsList = await Innings.find({ matchId })
        .sort({ inningsNumber: 1 })
        .populate("battingTeam bowlingTeam");

    const stats = await PlayerStats.find({ matchId })
        .populate({
            path: "playerId",
            populate: {
                path: "team"
            }
        });

    const getTeamName = (team) =>
        team && typeof team === "object" ? team.name : team;

    const getTeamId = (team) =>
        team && typeof team === "object"
            ? team._id.toString()
            : team.toString();

    const scorecard = [];

    for (let inn of inningsList) {
        const battingTeamId = getTeamId(inn.battingTeam);
        const bowlingTeamId = getTeamId(inn.bowlingTeam);
        const battingStats = stats.filter((s) => {
            return (
                s.playerId &&
                String(s.playerId.team?._id || s.playerId.team) === battingTeamId &&
                (s.ballsFaced > 0 || s.runs > 0)
            );
        });

        const bowlingStats = stats.filter((s) => {
            return (
                s.playerId &&
                String(s.playerId.team?._id || s.playerId.team) === bowlingTeamId &&
                (s.ballsBowled > 0 || s.runsConceded > 0)
            );
        });

        const balls = await Ball.find({ inningsId: inn._id })
            .populate("batsman bowler", "name");

        scorecard.push({
            inningsNumber: inn.inningsNumber,
            battingTeam: getTeamName(inn.battingTeam),
            bowlingTeam: getTeamName(inn.bowlingTeam),
            totalRuns: inn.totalRuns,
            wickets: inn.wickets,
            overs: `${inn.overs}.${inn.balls}`,
            score: `${inn.totalRuns}/${inn.wickets}`,
            target: inn.target,

            batting: battingStats.map((p) => ({
                name: p.playerId.name,
                runs: p.runs,
                balls: p.ballsFaced || 0,  
                fours: p.fours || 0,
                sixes: p.sixes || 0
            })),

            bowling: bowlingStats.map((p) => ({
                name: p.playerId.name,
                wickets: p.wickets,
                runsConceded: p.runsConceded,
                balls: p.ballsBowled || 0  
            })),

            balls: balls.map((b) => ({
                _id: b._id,
                runs: b.runs,
                isWicket: b.isWicket,
                wicketType: b.wicketType,
                isExtra: b.isExtra,
                extraType: b.extraType,
                batsman: b.batsman?.name || b.batsman,
                bowler: b.bowler?.name || b.bowler,
                over: b.over,
                ball: b.ball
            }))
        });
    }

    let winner = null;
    let result = match.result;

    if (inningsList.length > 0) {
        const lastInnings = inningsList[inningsList.length - 1];

        if (lastInnings.target && lastInnings.totalRuns >= lastInnings.target) {
            winner = getTeamName(lastInnings.battingTeam);
            result = `${winner} won`;
        }
    }

    return res.json(
        new ApiResponse(200, {
            matchInfo: {
                teamA: match.teamA.name,
                teamB: match.teamB.name,
                status: match.status,
                result,
                winner,
                summary: `${match.teamA.name} vs ${match.teamB.name} - ${match.status}${
                    result ? ` (${result})` : ""
                }`
            },
            innings: scorecard
        })
    );
});

export { getScorecard };