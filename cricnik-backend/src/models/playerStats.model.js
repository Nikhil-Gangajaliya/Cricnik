import mongoose, { Schema } from 'mongoose';

const playerStatsSchema = new Schema(
    {
        playerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player",
            required: true,
        },

        matchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Match",
            required: true,
        },

        runs: {
            type: Number,
            default: 0,
        },

        wickets: {
            type: Number,
            default: 0,
        },

        runsConceded: {
            type: Number,
            default: 0,
        },
        fours: {
            type: Number,
            default: 0
        },
        sixes: {
            type: Number,
            default: 0
        },
        overs: {
            type: Number,
            default: 0
        },
        ballsFaced: { type: Number, default: 0 },
        ballsBowled: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

// prevent duplicate stats per match
playerStatsSchema.index({ playerId: 1, matchId: 1 }, { unique: true });

export const PlayerStats = mongoose.model("PlayerStats", playerStatsSchema);