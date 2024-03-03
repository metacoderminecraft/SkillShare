import mongoose from "mongoose";

const bookSchema = mongoose.bookSchema(
    {
        //test stuff
        title: {
            type: String,
            require: true
        }
    },
    {
        timestamps: true
    }
);

export const bookModel = mongoose.model("bookModel", bookSchema)

