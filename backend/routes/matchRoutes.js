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
        const requester = await Skill.findById(request.body.requesterId);

        const recipient = await Skill.findById(request.body.recipientId);

        if (!recipient || !requester) {
            return response.status(404).send({ message: "No such skill" });
        }

        if (requester.user == recipient.user) {
            return response.status(400).send({ message: "self-request" });
        }

        const newMatch = {
            requester: requester._id,
            recipient: recipient._id,
        }

        const match = await Match.create(newMatch);

        //update preferences

        response.status(200).send(match);
    } catch (error) {
        console.log(error);
        response.status(500).send({message: error.message});
    }
})

router.post("/approve", isAuthenticated, async (request, response) => {
    try {
        const match = await Match.findById(request.body.matchId).populate('recipient');
        console.log(match);

        if (match.recipient.user != request.session.userId) {
            return response.status(401).send({ message: "Unauthorized to approve" });
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
        const match = await Match.findById(request.body.matchId).populate('recipient');

        if (match.recipient.user != request.session.userId) {
            return response.status(401).send({ message: "Unauthroized to reject" });
        }

        match.status = "rejected";
        await match.save();

        return response.status(201).send({ message: "Successfully rejected!" });
    } catch (error) {
        console.log(error);
        return response.status(500).send({ message: error.message });
    }
})

router.get("/outgoing", isAuthenticated, async (request, response) => {
    try {

        //to fix
        const userId = request.session.userId;

        const outgoing = await Match.find({ 'requester.user': userId, status: "pending" })
            .populate({
                path: 'requester',
                populate: {
                    path: ' user'
                }
            })
            .populate({
                path: 'recipient',
                populate: {
                    path: 'user'
                }
            });

        return response.status(200).send({ data: outgoing });
        
    } catch (error) {
        console.log(error);
        return response.status(500).send({ message: error.message });
    }
})

router.get("/incoming", isAuthenticated, async (request, response) => {
    try {
        const userId = request.session.userId;

        // Step 1: Fetch and populate the matches
        const matches = await Match.find({ status: "pending" })
            .populate({
                path: 'recipient',
                populate: {
                    path: 'user'
                }
            })
            .populate({
                path: 'requester',
                populate: {
                    path: 'user'
                }
            });

        // Step 2: Filter the results
        const incoming = matches.filter(match => {
            return match.recipient.user._id.equals(userId) && !match.requester.user._id.equals(userId);
        });

        return response.status(200).send({ incoming });
        
    } catch (error) {
        console.log(error);
        return response.status(500).send({ message: error.message });
    }
})

router.get("/approved", isAuthenticated, async (request, response) => {
    try {
        const userId = request.session.userId;

        const matches = await Match.find({ status: 'approved' })
        .populate({
            path: 'recipient',
            populate: {
                path: 'user'
            }
        })
        .populate({
            path: 'requester',
            populate: {
                path: 'user'
            }
        });

        const approved = matches.filter((match) => {
            return match.recipient.user._id.equals(userId) || match.requester.user._id.equals(userId)
        })

        return response.status(200).send({ approved });
        
    } catch (error) {
        console.log(error);
        return response.status(500).send({ message: error.message });
    }
})

router.get("/rejected", isAuthenticated, async (request, response) => {
    try {
        const userId = request.session.userId;

        const matches = await Match.find({ status: 'rejected' })
        .populate({
            path: 'recipient',
            populate: {
                path: 'user'
            }
        })
        .populate({
            path: 'requester',
            populate: {
                path: 'user'
            }
        });

        const rejected = matches.filter((match) => {
            return match.recipient.user._id.equals(userId) || match.requester.user._id.equals(userId)
        })

        return response.status(200).send({ rejected });       
    } catch (error) {
        console.log(error);
        return response.status(500).send({ message: error.message });
    }
})

router.get("/:id", async (request, response) => {
    try {
        const { id } = request.params;

        const match = await Match.findById(id)
            .populate({
                path: 'requester',
                populate: {
                    path: ' user'
                }
            })
            .populate({
                path: 'recipient',
                populate: {
                    path: 'user'
                }
            });

        if (!match) {
            return response.status(404);
        }

        return response.status(200).send({ match });
    } catch (error) {
        return response.status(500).send({ message: error.message })
    }
})


//remove the following after project completion
router.get("/", async (request, response) => {
    try {
        const matches = await Match.find({}).populate({
            path: 'recipient',
            populate: {
                path: 'user'
            }
        }).populate({
            path: 'requester',
            populate: {
                path: 'user'
            }
        });

        return response.status(200).send({
            count: matches.length,
            data: matches
        })
    } catch (error) {
        console.log(error);
        return response.status(500).send({message: error.message});
    }
})

router.delete("/:id", async (request, response) => {
    try {
        const { id } = request.params;

        const match = await Match.findByIdAndDelete(id);

        if (!match) {
            return response.status(404);
        }

        return response.status(200);
    } catch (error) {
        console.log(error);
        return response.status(500).send({ message: error.message });
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