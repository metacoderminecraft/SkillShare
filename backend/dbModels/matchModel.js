//records quasitinder matches and agreed meeting details

import mongoose from "mongoose";

const bookSchema = mongoose.bookSchema(
    {
        match: {
            type: String,
            require: true
        },
        date: {
            type: Number,
            require: true
        }
    },
    {
        timestamps: true
    }
);

export const matchModel = mongoose.model("matchModel", bookSchema)