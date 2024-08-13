import mongoose from "mongoose";

const skillSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        title: {
            type: String,
            maxLength: 25,
            required: true,
        },
        description: {
            type: String,
            maxLength: 500,
            required: true
        },
        focus: {
            type: String,
            enum: ["tech", "art", "wellness", "sports"],
            required: true,
        }
    }
);

export const Skill = mongoose.model("Skill", skillSchema);