import mongoose, { Schema } from 'mongoose';

const matchSchema = new Schema(
    {
        teamA: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true,
        },
        teamB: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true,
        },
        tossWonBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true
        },
        electedTo: {
            type: String,
            enum: ["bat", "bowl"],
            required: true
        },
        maxOvers: {
            type: Number,
            default: 20
        },
        innings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Innings"
            }
        ],
        venue: String,
        date: Date,
        result: String,
        status: {
            type: String,
            enum: ["upcoming", "live", "break", "completed"],
            default: "upcoming",
        },
        winner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            default: null
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }

    },
    {
        timestamps: true,
    }
);

export const Match = mongoose.model('Match', matchSchema);