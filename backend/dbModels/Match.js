//records quasitinder matches and agreed meeting details

import mongoose from "mongoose";

const matchSchema = mongoose.Schema(
    {
        requester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        status : {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Match = mongoose.model("Match", matchSchema)