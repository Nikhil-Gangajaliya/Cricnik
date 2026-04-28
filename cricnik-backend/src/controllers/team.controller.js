import { Team } from "../models/team.model.js";
import { Player } from "../models/player.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTeam = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const team = await Team.create({ user: req.user._id, name });

    return res.json(new ApiResponse(201, team));
});

const deleteTeam = asyncHandler(async (req, res) => {
    const team = await Team.findById(req.params.id);

    if (!team) {
        throw new ApiError(404, "Team not found");
    }

    if (team.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    await Player.deleteMany({ team: team._id });

    await team.deleteOne();

    return res.json(new ApiResponse(200, {}, "Team deleted successfully"));
});

const updateTeam = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const team = await Team.findById(req.params.id);

    if (!team) {
        throw new ApiError(404, "Team not found");
    }

    if (team.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    team.name = name || team.name;

    await team.save();

    return res.json(new ApiResponse(200, team, "Team updated"));
});

const getTeams = asyncHandler(async (req, res) => {
    const teams = await Team.find({ user: req.user._id }).populate("players");

    return res.json(new ApiResponse(200, teams));
});

export {
    createTeam,
    deleteTeam,
    updateTeam,
    getTeams
}