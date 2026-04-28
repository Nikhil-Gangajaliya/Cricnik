import mongoose, { Schema } from 'mongoose';

const ballSchema = new Schema(
    {
        inningsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Innings",
            required: true,
        },

        runs: {
            type: Number,
            required: true,
        },

        isWicket: {
            type: Boolean,
            default: false,
        },

        wicketType: {
            type: String,
            enum: ["bowled", "caught", "lbw", "runout", "stumped"],
            default: null
        },

        isExtra: {
            type: Boolean,
            default: false
        },

        extraType: {
            type: String,
            enum: ["wide", "no-ball", "bye", "leg-bye"],
            default: null
        },

        batsman: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player",
        },

        bowler: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player",
        },

        over: Number,
        ball: Number
    },
    { timestamps: true }
);

export const Ball = mongoose.model('Ball', ballSchema);