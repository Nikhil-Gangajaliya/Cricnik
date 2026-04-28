import { Innings } from "../models/innings.model.js";
import { Ball } from "../models/ball.model.js";
import { PlayerStats } from "../models/playerStats.model.js";
import { Match } from "../models/match.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addBall = asyncHandler(async (req, res) => {
    let {
        inningsId,
        runs = 0,
        isWicket = false,
        wicketType = null,
        newBatsmanId = null,
        isExtra = false,
        extraType = null
    } = req.body;

    runs = Number(runs);

    const innings = await Innings.findById(inningsId);
    if (!innings) throw new ApiError(404, "Innings not found");

    if (innings.isCompleted) {
        throw new ApiError(400, "Innings already completed");
    }

    const striker = innings.striker;
    const bowler = innings.currentBowler;

    if (!striker || !bowler) {
        throw new ApiError(400, "Invalid striker or bowler");
    }

    const totalPlayers = innings.battingOrder?.length || 0;
    if (totalPlayers === 0) {
        throw new ApiError(400, "Batting order missing");
    }

    const isLegalBall = !(isExtra && (extraType === "wide" || extraType === "no-ball"));

    innings.totalRuns = (innings.totalRuns || 0) + runs;

    if (isLegalBall) {
        innings.balls += 1;
    }

    const currentOver = innings.overs;
    const currentBall = innings.balls;

    await Ball.create({
        inningsId,
        runs,
        isWicket,
        isExtra,
        extraType,
        batsman: striker,
        bowler,
        over: currentOver,
        ball: currentBall
    });

    if (innings.balls === 6) {
        innings.overs += 1;
        innings.balls = 0;

        innings.lastOverBowler = innings.currentBowler;

        [innings.striker, innings.nonStriker] =
            [innings.nonStriker, innings.striker];
    }

    if (isWicket) {
        if (!Array.isArray(innings.outPlayers)) {
            innings.outPlayers = [];
        }

        innings.wickets += 1;
        innings.outPlayers.push(striker);

        const isLastWicket = innings.wickets === totalPlayers - 1;

        if (!isLastWicket) {
            if (!newBatsmanId) {
                throw new ApiError(400, "New batsman required");
            }
            innings.striker = newBatsmanId;
        } else {
            const isLastWicket = innings.wickets === totalPlayers - 1;

            if (!isLastWicket) {
                if (!newBatsmanId) {
                    throw new ApiError(400, "New batsman required");
                }
                innings.striker = newBatsmanId;
            }

        }
    }

    if (!isWicket && !isExtra && runs % 2 !== 0) {
        [innings.striker, innings.nonStriker] =
            [innings.nonStriker, innings.striker];
    }

    let bat = await PlayerStats.findOne({
        playerId: striker,
        matchId: innings.matchId
    });

    if (!bat) {
        bat = await PlayerStats.create({
            playerId: striker,
            matchId: innings.matchId,
            runs: 0,
            ballsFaced: 0,
            fours: 0,
            sixes: 0
        });
    }

    if (!isExtra) bat.runs += runs;
    if (isLegalBall) bat.ballsFaced += 1;
    if (!isExtra && runs === 4) bat.fours += 1;
    if (!isExtra && runs === 6) bat.sixes += 1;

    await bat.save();

    let bowl = await PlayerStats.findOne({
        playerId: bowler,
        matchId: innings.matchId
    });

    if (!bowl) {
        bowl = await PlayerStats.create({
            playerId: bowler,
            matchId: innings.matchId,
            runsConceded: 0,
            ballsBowled: 0,
            wickets: 0
        });
    }

    bowl.runsConceded += runs;
    if (isLegalBall) bowl.ballsBowled += 1;
    if (isWicket && wicketType !== "runout") bowl.wickets += 1;

    await bowl.save();

    if (innings.target && innings.totalRuns >= innings.target) {
        innings.isCompleted = true;

        const match = await Match.findById(innings.matchId);

        const wicketsLeft = (totalPlayers - 1) - innings.wickets;

        match.status = "completed";
        match.winner = innings.battingTeam;
        match.result = `Won by ${wicketsLeft} wickets`;

        await match.save();
        await innings.save();

        return res.json(new ApiResponse(200, innings, "Match finished"));
    }

    if (innings.wickets === totalPlayers - 1 || innings.overs === innings.maxOvers) {
        innings.isCompleted = true;

        const match = await Match.findById(innings.matchId);

        if (match.innings.length === 1) {
            match.status = "break";
        } else {
            const firstInnings = await Innings.findById(match.innings[0]);

            let winner, result;

            if (innings.totalRuns >= firstInnings.totalRuns) {
                winner = innings.battingTeam;
                result = `Won by ${totalPlayers - 1 - innings.wickets} wickets`;
            } else {
                winner = firstInnings.battingTeam;
                result = `Won by ${firstInnings.totalRuns - innings.totalRuns} runs`;
            }

            match.status = "completed";
            match.result = result;
            match.winner = winner;
        }

        await match.save();
        await innings.save();

        return res.json(new ApiResponse(200, innings, "Innings completed"));
    }

    await innings.save();

    return res.json(new ApiResponse(200, innings, "Ball added"));
});

const changeBowler = asyncHandler(async (req, res) => {
    const { inningsId, newBowlerId } = req.body;

    const innings = await Innings.findById(inningsId)
        .populate("bowlingTeam");

    if (!innings) throw new ApiError(404, "Innings not found");

    if (innings.isCompleted) {
        throw new ApiError(400, "Innings already completed");
    }

    if (!innings.bowlingTeam.players.map(p => p.toString()).includes(newBowlerId)) {
        throw new ApiError(400, "Invalid bowler");
    }

    if (innings.currentBowler.toString() === newBowlerId) {
        throw new ApiError(400, "Same bowler not allowed");
    }

    if (
        innings.lastOverBowler &&
        innings.lastOverBowler.toString() === newBowlerId
    ) {
        throw new ApiError(400, "Bowler cannot bowl consecutive overs");
    }

    innings.currentBowler = newBowlerId;

    await innings.save();

    return res.json(new ApiResponse(200, innings, "Bowler changed"));
});


const startSecondInnings = asyncHandler(async (req, res) => {
    const { matchId, strikerId, nonStrikerId, bowlerId } = req.body;

    const match = await Match.findById(matchId)
        .populate({
            path: "teamA",
            populate: { path: "players" }
        })
        .populate({
            path: "teamB",
            populate: { path: "players" }
        });

    if (!match) throw new ApiError(404, "Match not found");

    if (match.innings.length !== 1) {
        throw new ApiError(400, "Second innings already exists");
    }

    const firstInnings = await Innings.findById(match.innings[0]);

    const battingTeam =
        String(firstInnings.bowlingTeam) === String(match.teamA._id)
            ? match.teamA
            : match.teamB;

    const bowlingTeam =
        String(firstInnings.battingTeam) === String(match.teamA._id)
            ? match.teamA
            : match.teamB;

    const secondInnings = await Innings.create({
        matchId: match._id,
        inningsNumber: 2,
        battingTeam: battingTeam._id,
        bowlingTeam: bowlingTeam._id,
        striker: strikerId,
        nonStriker: nonStrikerId,
        currentBowler: bowlerId,
        target: firstInnings.totalRuns + 1,
        maxOvers: match.maxOvers,
        outPlayers: [],
        lastOverBowler: null,
        battingOrder: battingTeam.players.map(p => p._id)
    });

    match.innings.push(secondInnings._id);
    match.status = "live";

    await match.save();

    return res.json(new ApiResponse(200, secondInnings));
});

export {
    addBall,
    changeBowler,
    startSecondInnings
};