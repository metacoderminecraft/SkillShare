import express from "express";
import { userModel } from "../dbModels/userModel.js";
import { matchModel } from "../dbModels/matchModel.js";

const router = express.Router();

router.post("/", async (request, response) => {
    try {
        if (!request.body.username ||
            !request.body.password
        ) {
            return response.status(400).send( {message: "send all fields" });
        }

        const newUser = {
            username: request.body.username,
            password: request.body.password
        }

        const user = await userModel.create(newUser);

        response.status(201).send(user);
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: error.message });
    }
})

router.get("/", async (request, response) => {
    try {
        const users = await userModel.find({});
        return response.status(200).json({
            count: users.length,
            data: users
        })
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: error.message });
    }
})

router.get("/:username", async (request, response) => {
    try {
        const { username } = request.params;

        const user = await userModel.findOne({ username: username });

        if (!user) {
            return response.status(404).send({ message: "User not found " });
        }

        return response.status(200).json(user);

    } catch (error) {
        console.log(error);
        return response.status(500).send({ message: error.message });
    }
})

router.delete("/:id", async (request, response) => {
    try {
        const { id } = request.params;

        const user = await userModel.findByIdAndDelete(id);

        if (!user) {
            return response.status(404).send({ message: "User not found" });
        }

        return response.status(200).send({ message: "User deleted" });
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: error.message });
    }
})

//delete ALL Users (danger)
router.delete("/", async (request, response) => {
    try {
        await userModel.deleteMany({});

        return response.status(200).send({ message: "User Database Cleared!" });
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: error.message });
    }
})


export default router;