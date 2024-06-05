import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            require: true
        },
        password: {
            type: String,
            require: true
        }
    }
)

export const userModel = mongoose.model("userModel", UserSchema);