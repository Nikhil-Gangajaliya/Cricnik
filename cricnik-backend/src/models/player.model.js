import mongoose, { Schema } from 'mongoose';

const playerSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
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

export const Player = mongoose.model('Player', playerSchema);