import { Match } from "../models/match.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createMatch = asyncHandler(async (req, res) => {
    const match = await Match.create({...req.body, user: req.user._id});

    return res.status(201).json(
        new ApiResponse(201, match, "Match created successfully")
    );
});

const deleteMatch = asyncHandler(async (req, res) => {
    const match = await Match.findById(req.params.id);

    if (!match) {
        throw new ApiError(404, "Match not found");
    }

    if (match.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    await match.deleteOne();

    return res.json(new ApiResponse(200, {}, "Match deleted successfully"));
});

const getMatches = asyncHandler(async (req, res) => {
    const matches = await Match.find({ user: req.user._id })
        .populate("teamA teamB winner")
        .populate("innings") // 🔥 IMPORTANT
        .sort({ createdAt: -1 });

    const data = matches.map(m => {

        let winnerName = null;

        if (m.status === "completed" && m.winner) {
            winnerName = m.winner.name;
        }

        const getTeamScore = (teamId) => {
            const inn = m.innings?.find(
                i => String(i.battingTeam) === String(teamId)
            );

            return inn
                ? {
                    score: `${inn.totalRuns || 0}/${inn.wickets || 0}`,
                    overs: `${inn.overs || 0}.${inn.balls || 0}`
                }
                : null;
        };

        const teamAData = getTeamScore(m.teamA._id);
        const teamBData = getTeamScore(m.teamB._id);

        return {
            _id: m._id,
            teamA: m.teamA,
            teamB: m.teamB,
            venue: m.venue,
            date: m.date,
            status: m.status,
            result: m.result || "Not completed",
            winner: winnerName,

            teamAScore: teamAData?.score || null,
            teamAOvers: teamAData?.overs || null,

            teamBScore: teamBData?.score || null,
            teamBOvers: teamBData?.overs || null
        };
    });

    return res.json(new ApiResponse(200, data));
});


const getMatchById = asyncHandler(async (req, res) => {
    const match = await Match.findById(req.params.id)
        .populate({
            path: "teamA",
            populate: { path: "players" }
        })
        .populate({
            path: "teamB",
            populate: { path: "players" }
        })
        .populate({
            path: "innings",
            populate: [
                {
                    path: "battingTeam",
                    populate: { path: "players" }   
                },
                {
                    path: "bowlingTeam",
                    populate: { path: "players" }   
                },
                { path: "striker" },
                { path: "nonStriker" },
                { path: "currentBowler" }
            ]
        })

    if (!match) {
        throw new ApiError(404, "Match not found");
    }

    const scorecard = match.innings.map((inn, index) => {
        return {
            innings: index + 1,
            team: inn.battingTeam?.name,
            score: `${inn.totalRuns || 0}/${inn.wickets || 0}`,
            target: inn.target || null
        };
    });

    let winner = 'Match not completed';

    if (match.status === 'completed' && match.winner) {
        winner = match.teamA._id.equals(match.winner)
            ? match.teamA.name
            : match.teamB.name;
    }

    const responseData = {
        ...match.toObject(),
        scorecard,
        winner
    };

    return res.json(new ApiResponse(200, responseData));
});

const getRecentMatches = asyncHandler(async (req, res) => {
    const matches = await Match.find({ user: req.user._id })
        .populate("teamA teamB winner")
        .populate("innings")
        .sort({ createdAt: -1 }) 
        .limit(3); 
    const data = matches.map(m => {

        let winnerName = null;

        if (m.status === "completed" && m.winner) {
            winnerName = m.winner.name;
        }

        const getTeamScore = (teamId) => {
            const inn = m.innings?.find(
                i => String(i.battingTeam) === String(teamId)
            );

            return inn
                ? {
                    score: `${inn.totalRuns || 0}/${inn.wickets || 0}`,
                    overs: `${inn.overs || 0}.${inn.balls || 0}`
                }
                : null;
        };

        const teamAData = getTeamScore(m.teamA._id);
        const teamBData = getTeamScore(m.teamB._id);

        return {
            _id: m._id,
            teamA: m.teamA,
            teamB: m.teamB,
            venue: m.venue,
            date: m.date,
            status: m.status,
            result: m.result || "Not completed",
            winner: winnerName,

            teamAScore: teamAData?.score || null,
            teamAOvers: teamAData?.overs || null,

            teamBScore: teamBData?.score || null,
            teamBOvers: teamBData?.overs || null
        };
    });

    return res.json(new ApiResponse(200, data));
});

export {
    createMatch,
    deleteMatch,
    getMatches,
    getMatchById,
    getRecentMatches
};