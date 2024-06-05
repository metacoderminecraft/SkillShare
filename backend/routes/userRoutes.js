import express from "express";
import { userModel } from "../dbModels/userModel.js";

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
        const users = await userModel.find({}).select("username");
        return response.status(200).send({
            count: users.length,
            data: users
        })
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: error.message });
    }
})


export default router;