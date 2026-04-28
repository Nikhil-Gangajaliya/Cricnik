import { Innings } from "../models/innings.model.js";
import { PlayerStats } from "../models/playerStats.model.js";
import { Match } from "../models/match.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const startMatch = asyncHandler(async (req, res) => {
    const { strikerId, nonStrikerId, bowlerId } = req.body;

    const match = await Match.findById(req.params.id)
        .populate({
            path: "teamA",
            populate: { path: "players" }
        })
        .populate({
            path: "teamB",
            populate: { path: "players" }
        });

    if (!match) {
        throw new ApiError(404, "Match not found");
    }

    if (match.status === "live") {
        throw new ApiError(400, "Match already started");
    }

    let battingTeam, bowlingTeam;

    if (match.electedTo === "bat") {
        battingTeam = match.teamA._id.equals(match.tossWonBy)
            ? match.teamA
            : match.teamB;

        bowlingTeam = match.teamA._id.equals(match.tossWonBy)
            ? match.teamB
            : match.teamA;
    } else {
        bowlingTeam = match.teamA._id.equals(match.tossWonBy)
            ? match.teamA
            : match.teamB;

        battingTeam = match.teamA._id.equals(match.tossWonBy)
            ? match.teamB
            : match.teamA;
    }


    const battingPlayerIds = battingTeam.players.map(p => p._id.toString());
    const bowlingPlayerIds = bowlingTeam.players.map(p => p._id.toString());

    if (!battingPlayerIds.includes(strikerId) || !battingPlayerIds.includes(nonStrikerId)) {
        throw new ApiError(400, "Striker/non-striker must belong to batting team");
    }

    if (!bowlingPlayerIds.includes(bowlerId)) {
        throw new ApiError(400, "Bowler must belong to bowling team");
    }

    if (strikerId === nonStrikerId) {
        throw new ApiError(400, "Striker and non-striker cannot be same");
    }

    const innings = await Innings.create({
        matchId: match._id,
        inningsNumber: 1,
        battingTeam: battingTeam._id,
        bowlingTeam: bowlingTeam._id,
        striker: strikerId,
        nonStriker: nonStrikerId,
        currentBowler: bowlerId,
        maxOvers: match.maxOvers,
        battingOrder: battingTeam.players.map(p => p._id)
    });

    match.innings.push(innings._id);
    match.status = "live";
    await match.save();

    const allPlayers = [...battingTeam.players, ...bowlingTeam.players];

    for (let p of allPlayers) {
        await PlayerStats.create({
            playerId: p._id,
            matchId: match._id
        });
    }

    return res.json(new ApiResponse(200, innings));
});

export {
    startMatch
}