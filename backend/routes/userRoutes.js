import express, { request } from "express";
import { userModel } from "../dbModels/userModel.js";

const router = express.Router();

router.post("/register", async (request, response) => {
    try {
        if (!request.body.username ||
            !request.body.password
        ) {
            return response.status(400).send( {message: "send all fields" });
        }   

        const newUser = new userModel({
            username: request.body.username,
            password: request.body.password
        });
        await newUser.save();
        request.session.userId = newUser._id;

        return response.status(201).send({ message: "User registered", newUser });
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: error.message });
    }
})

router.post('/login', async (request, response) => {
    try {
        const user = await userModel.findOne({ username: request.body.username });
        if (!user || !(await user.comparePassword(request.body.password))) {
            return response.status(400).send({ message: "Invalid Credentials!"} );
        }

        request.session.userId = user._id;

        return response.status(200).json({ user });

    } catch (error) {
        console.log(error);
        return response.status(500).send({ message: error.message });
    }
})

router.post('/logout', async (request, response) => {
    request.session.destroy(err => {
        if (err) {
            return response.status(500).send({ message: "Error logging out"} );
        }

        response.clearCookie('connect.sid');
        response.status(200).send({ message: "Logged Out" });
    });
})

router.get('/checkAuth', async (request, response) => {
    if (request.session.userId) {
        const user = await userModel.findById(request.session.userId);
        return response.status(200).json({ authenticated: true, user });
    } else {
        return response.status(200).json({ authenticated: false });
    }
});

//remove following after project completion; for testing purposes

router.post("/confirmUser", async (request, response) => {
    try {
        const user = await userModel.findOne({ username: request.body.username });

        if (!user) {
            return response.status(200).json({ exists: false });
        }

        return response.status(200).json({ exists: true });
    } catch (error) {
        console.log(error);
        return response.status(500).send({ message: error.message });
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


export default router;