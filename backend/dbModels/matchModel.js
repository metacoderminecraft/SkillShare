//records quasitinder matches and agreed meeting details

import mongoose from "mongoose";

const matchSchema = mongoose.Schema(
    {
        user1: {
            type: String,
            require: true
        },
        user2: {
            type: String,
            require: true
        },
        date: {
            type: Date,
            require: true
        }
    },
    {
        timestamps: true
    }
);

export const matchModel = mongoose.model("matchModel", matchSchema)