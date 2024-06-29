import express, { request } from "express";
import { User } from "../dbModels/User.js";
import mongoose from "mongoose";

const router = express.Router();

const isAuthenticated = (request, response, next) => {
    if (request.session.userId) {
        return next();
    }

    return response.status(401).send({ message: "Unauthorized from authentication" });
}

router.post("/register", async (request, response) => {
    try {
        if (!request.body.username ||
            !request.body.password
        ) {
            return response.status(400).send( {message: "send all fields" });
        }
        
        const otherUsers = User.findOne({ username: request.body.username });

        if (otherUsers) {
            return response.status(409).send({ message: "username taken" });
        }

        const newUser = new User({
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
        const user = await User.findOne({ username: request.body.username });
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
        const user = await User.findById(request.session.userId);
        return response.status(200).json({ authenticated: true, user });
    } else {
        return response.status(200).json({ authenticated: false });
    }
});

router.get("/match", isAuthenticated, async (request, response) => {
    try {
        const userId = request.session.userId;

        const random = await User.aggregate([
            //don't recommend themselves
            { $match: { _id: { $ne: mongoose.Types.ObjectId.createFromHexString(userId)} } },
            { $sample: { size: 1 } }
        ]);

        return response.status(200).send({ user: random[0] });
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: error.message });
    }
})

//remove following after project completion; for testing purposes

router.get("/", async (request, response) => {
    try {
        const users = await User.find({});
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

        const user = await User.findByIdAndDelete(id);

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