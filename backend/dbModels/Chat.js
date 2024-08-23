import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
    {
        match: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Match",
            required: true
        },
        users: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }],
            validate: {
                validator: function(arr) {
                    // Validate the length of the array
                    return arr.length === 2;
                },
                message: "A chat must involve exactly two users."
            }
        },
        messages: [{
            message: {
                type: String,
                required: true
            },
            sender: {
                type: String,
                required: true
            }
        }]
    }
)

export const Chat = mongoose.model("Chat", chatSchema)