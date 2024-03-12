//stores user information, credentials, skills

import mongoose from "mongoose";

const bookSchema = mongoose.bookSchema(
    {
        username: {
            type: String,
            require: true
        }
    },
    {
        timestamps: true
    }
);

export const userModel = mongoose.model("userModel", bookSchema)

