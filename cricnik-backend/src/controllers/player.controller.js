import { Player } from "../models/player.model.js";
import { Team } from "../models/team.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlayer = asyncHandler(async (req, res) => {
    const data = req.body;


    if (Array.isArray(data)) {

        const playersData = data.map(p => ({
            name: p.name,
            team: p.teamId,
            user: req.user._id   
        }));

        const players = await Player.insertMany(playersData);

        const teamId = data[0].teamId;

        await Team.findByIdAndUpdate(teamId, {
            $push: { players: { $each: players.map(p => p._id) } }
        });

        return res.json(new ApiResponse(201, players));
    }

    const { name, teamId } = data;

    const player = await Player.create({
        name,
        team: teamId,
        user: req.user._id   
    });

    await Team.findByIdAndUpdate(teamId, {
        $push: { players: player._id }
    });

    return res.json(new ApiResponse(201, player));
});

const deletePlayer = asyncHandler(async (req, res) => {
    const player = await Player.findById(req.params.id);

    if (!player) {
        throw new ApiError(404, "Player not found");
    }

    if (player.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    await Team.findByIdAndUpdate(player.team, {
        $pull: { players: player._id }
    });

    await player.deleteOne();

    return res.json(new ApiResponse(200, {}, "Player deleted"));
});

const updatePlayer = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const player = await Player.findById(req.params.id);

    if (!player) {
        throw new ApiError(404, "Player not found");
    }

    if (player.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    player.name = name || player.name;

    await player.save();

    return res.json(new ApiResponse(200, player, "Player updated"));
});

const getPlayersByTeam = asyncHandler(async (req, res) => {
    const players = await Player.find({
        team: req.params.id,
        user: req.user._id  
    });

    return res.json(new ApiResponse(200, players));
});

export{
    createPlayer,
    deletePlayer,
    updatePlayer,
    getPlayersByTeam
}