import express from 'express';
import { Chat } from '../dbModels/Chat.js';
import { User } from '../dbModels/User.js';
import { Match } from '../dbModels/Match.js'
import mongoose from 'mongoose';

const router = express.Router();

//authentication middleware
const isAuthenticated = (request, response, next) => {
    if (request.session.userId) {
        return next();
    }

    return response.status(401).send({ message: "Unauthorized from authentication" });
}

router.post("/confirm", isAuthenticated, async (request, response) => {
    try {
        const creator = request.session.userId;
        const reciever = await User.findOne({ _id: request.body.recieverId });
        const match = await Match.findOne({ _id: request.body.matchId });

        if (!reciever || !match) {
            return response.status(404).send({ message: "no match or reciever" })
        }

        let chat = await Chat.findOne({
            match: match._id,
            users: {
                $all: [
                    creator,
                    reciever._id,
                ]
            }
        })

        if (chat) {
            return response.status(200).send({ chat })
        }

        chat = await Chat.create({
            match: match._id,
            users: [
                creator,
                reciever._id
            ],
            messages: []
        })

        return response.status(201).send({ chat })
    } catch (error) {
        console.log(error);
        return response.status(500).send({ message: error.message })
    }
})

router.post("/send", isAuthenticated, async (request, response) => {
    try {
        const userId = request.session.userId;
        const message = request.body.message;
        let chat = await Chat.findOne({ _id: request.body.chatId });
        const sender = await User.findById(request.session.userId);

        if (!chat) {
            return response.status(404).send({ message: "no such chat" })
        }

        if (!chat.users.includes(userId)) {
            return response.status(404).send({ message: "not your chat!" })
        }

        chat = await Chat.findByIdAndUpdate(
            request.body.chatId,
            { $push: { messages: { message, sender: sender.username } } },
            { new: true, runValidators: true }
        )

        return response.status(201).send({ chat });
    } catch (error) {
        console.log(error);
        return response.status(500).send({ message: error.message })
    }
})

//delete after project completion
router.get("/", async (request, response) => {
    try {
        const chats = await Chat.find({});

        return response.status(200).send({ 
            count: chats.length,
            data: chats
        })
    } catch (error) {
        console.log(error);
        return response.status(500).send({ message: error.message })
    }    
})

router.delete("/", async (request, response) => {
    try {
        await Chat.deleteMany({});

        return response.status(201).send({});
    } catch (error) {
        console.log(error);
        return response.status(500).send({ message: error.message })
    }
})

export default router;