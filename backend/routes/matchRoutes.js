import express from 'express';
import { Match } from '../dbModels/Match.js';
import { User } from '../dbModels/User.js';
import { Skill } from '../dbModels/Skill.js';
import mongoose from 'mongoose';

const router = express.Router();

//authentication middleware
const isAuthenticated = (request, response, next) => {
    if (request.session.userId) {
        return next();
    }

    return response.status(401).send({ message: "Unauthorized from authentication" });
}

router.post("/request", isAuthenticated, async (request, response) => {
    try {
        const requester = await User.findById(request.session.userId);

        const recipient = await Skill.findById(request.body.skillId);

        if (!recipient) {
            return response.status(404).send({ message: "No such skill" });
        }

        if (requester._id == recipient.user) {
            return response.status(400).send({ message: "self-request" });
        }

        const newMatch = {
            requester: requester._id,
            recipient: recipient._id,
            date: request.body.date
        }

        const match = await Match.create(newMatch);

        //update preferences
        requester.

        response.status(200).send(match);
    } catch (error) {
        console.log(error);
        response.status(500).send({message: error.message});
    }
})

router.post("/approve", isAuthenticated, async (request, response) => {
    try {
        const match = await Match.findById(request.body.matchId);

        if (match.recipient.user != request.session.userId) {
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

        if (match.recipient.user != request.session.userId) {
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
        const incoming = await Match.find({ "recipient.user": userId, status: "pending" }).populate('requester').populate('recipient');
        const approved = await Match.aggregate([
            {
                $match:  {
                    $or: [
                        { "recipient.user": mongoose.Types.ObjectId.createFromHexString(userId), status: "approved" },
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
                        { requester: mongoose.Types.ObjectId.createFromHexString(userId), status: "rejected" }
                    ]
                }
            }
        ]);

        await Match.populate(rejected, { path: 'requester' });
        await Match.populate(rejected, { path: 'recipient' });

        const rejectedMatchIds = rejected.map(match => match._id);
        await Match.deleteMany({ _id: { $in: rejectedMatchIds } });

        return response.status(200).send({ outgoing, incoming, approved, rejected })
    } catch (error) {
        console.log(error);
        return response.status(500).send({ message: error.message });
    }
})


//remove the following after project completion
router.get("/", async (request, response) => {
    try {
        const matches = await Match.find({}).populate('recipient').populate('requester');

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