// represents a skill offering, like details and availability

import mongoose from "mongoose";

const bookSchema = mongoose.bookSchema(
    {
        title: {
            type: String,
            require: true
        },
        description: {
            type: String,
            require: false
        }
    },
    {
        timestamps: true
    }
);

export const skillModel = mongoose.model("skillModel", bookSchema)