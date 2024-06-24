import express from 'express';
import { Match } from '../dbModels/Match.js';
import { User } from '../dbModels/User.js';
import mongoose from 'mongoose';

const router = express.Router();

const isAuthenticated = (request, response, next) => {
    if (request.session.userId) {
        return next();
    }

    return response.status(401).send({ message: "Unauthorized from authentication" });
}

router.post("/request", isAuthenticated, async (request, response) => {
    try {
        const requester = await User.findById(request.session.userId);

        const recipient = await User.findOne({ username: request.body.recipient });
        if (!recipient) {
            return response.status(404).send({ message: "No such recipient" });
        }

        if (requester._id == recipient._id) {
            return response.status(400).send({ message: "self-request" });
        }

        const newMatch = {
            requester: requester._id,
            recipient: recipient._id,
            date: request.body.date
        }

        const match = await Match.create(newMatch);

        response.status(200).send(match);
    } catch (error) {
        console.log(error);
        response.status(500).send({message: error.message});
    }
})

router.post("/approve", isAuthenticated, async (request, response) => {
    try {
        const match = await Match.findById(request.body.matchId);

        if (match.recipient != request.session.userId) {
            return response.status(401).send({ message: "Unauthorized to approve/reject" });
        }

        match.status = "approved";
        await match.save();

        return response.status(201).send({ message: "Successfully approved!" });
    } catch (error) {
        console.log(error);
        return response.status(500).send({ message: error.message });
    }
})

router.post("/reject", isAuthenticated, async (request, response) => {
    try {
        const match = await Match.findById(request.body.matchId);

        if (match.recipient != request.session.userId) {
            return response.status(401).send({ message: "Unauthroized to approve/reject" });
        }

        match.status = "rejected";
        await match.save();

        return response.status(201).send({ message: "Successfully rejected!" });
    } catch (error) {
        console.log(error);
        return response.status(500).send({ message: error.message });
    }
})

router.get("/myMatches", isAuthenticated, async (request, response) => {
    try {
        const userId = request.session.userId;

        const outgoing = await Match.find({ requester: userId, status: "pending" }).populate('recipient');
        const incoming = await Match.find({ recipient: userId, status: "pending" }).populate('requester');
        const approved = await Match.aggregate([
            {
                $match:  {
                    $or: [
                        { recipient: mongoose.Types.ObjectId.createFromHexString(userId), status: "approved" },
                        { requester: mongoose.Types.ObjectId.createFromHexString(userId), status: "approved" }
                    ]
                }
            }
          ]);
        await Match.populate(approved, { path: 'requester' });
        await Match.populate(approved, { path: 'recipient' });

        const rejected = await Match.aggregate([
            {
                $match: {
                    $or: [
                        { requester: userId, status: "rejected" },
                        { recipient: userId, status: "rejected"}
                    ]
                }
            }
        ]);

        return response.status(200).send({ outgoing, incoming, approved, rejected })
    } catch (error) {
        console.log(error);
        return response.status(500).send({ message: error.message });
    }
})

router.get("/", async (request, response) => {
    try {
        const matches = await Match.find({});

        return response.status(200).send({
            count: matches.length,
            data: matches
        })
    } catch (error) {
        console.log(error);
        return response.status(500).send({message: error.message});
    }
})

//Delete all matches (danger)
router.delete("/", async (request, response) => {
    try {
        await Match.deleteMany({});

        return response.status(200).send( {message: `You deleted all matches!`} ); 

    } catch (error) {
        console.log(error);
        return response.status(500).send( {message: error.message} );
    }
});

export default router;