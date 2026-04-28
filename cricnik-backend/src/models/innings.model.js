import mongoose, { Schema } from 'mongoose';

const inningsSchema = new Schema(
    {
        matchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Match",
            required: true,
        },

        battingTeam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true
        },
        bowlingTeam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true
        },
        totalRuns: {
            type: Number,
            default: 0,
        },
        wickets: {
            type: Number,
            default: 0,
        },

        overs: {
            type: Number,
            default: 0,
        },
        balls: {
            type: Number,
            default: 0,
        },
        striker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player",
            required: true
        },
        nonStriker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player",
            required: true
        },
        battingOrder: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Player"
            }
        ],
        currentBowler: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player",
            required: true
        },
        inningsNumber: {
            type: Number,
            enum: [1, 2],
            required: true
        },
        target: {
            type: Number,
            default: null
        },
        maxOvers: {
            type: Number,
            default: 20
        },
        isCompleted: {
            type: Boolean,
            default: false
        },
        outPlayers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Player"
            }
        ],
        lastOverBowler: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player"
        }
    },
    {
        timestamps: true,
    }
);

export const Innings = mongoose.model("Innings", inningsSchema);