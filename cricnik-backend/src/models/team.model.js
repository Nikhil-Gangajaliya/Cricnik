import mongoose, { Schema } from 'mongoose';

const teamSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        players: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Player'
            }
        ],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Team = mongoose.model('Team', teamSchema);