import express from 'express';
import { matchModel } from '../dbModels/matchModel.js';

const router = express.Router();

router.post("/", async (request, response) => {
    try {
        if (!request.body.user1 ||
            !request.body.user2 ||
            !request.body.date
        ) {
            return response.status(400).send({ message: "send all fields" })
        }

        const newMatch = {
            user1: request.body.user1,
            user2: request.body.user2,
            date: request.body.date
        }

        const match = await matchModel.create(newMatch);

        response.status(200).send(match);
    } catch (error) {
        console.log(error);
        response.status(500).send({message: error.message});
    }
})

router.get("/", async (request, response) => {
    try {
        const matches = await matchModel.find({});

        return response.status(200).send({
            count: matches.length,
            data: matches
        })
    } catch (error) {
        console.log(error);
        return response.status(500).send({message: error.message});
    }
})

router.get("/:id", async (request, response) => {
    try {
        const { id } = request.params;

        const match = await matchModel.findById(id);

        if (!match) {
            return response.status(404).send( {message: "Match Not Found"} );
        }

        return response.status(200).json(match);
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: error.message });
    }
})

router.get("/byUser/:username", async (request, response) => {
    try {
        const { username } = request.params;

        const user1Matches = await matchModel.find({ user1: username });
        const user2Matches = await matchModel.find({ user2: username });

        return response.status(200).send({
                isUser1: user1Matches,
                isUser2: user2Matches
        })
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: error.message });
    }
})

router.put("/:id", async (request, response) => {
    try {
        const { id } = request.params;

        if (!request.body.user1 ||
            !request.body.user2 ||
            !request.body.date
        ) {
            return response.status(400).send({ message: "send all fields" })
        }

        const newMatch = {
            user1: request.body.user1,
            user2: request.body.user2,
            date: request.body.date
        }

        const match = await matchModel.findByIdAndUpdate(id, newMatch);

        if (!match) {
            return response.status(404).send({ message: "Match not found" });
        }

        return response.status(200).send( {message: "Match Updated!" });        
    } catch (error) {
        console.log(error);
        response.status(500).send({message: error.message});
    }
})

router.delete("/:id", async (request, response) => {
    try {
        const { id } = request.params;

        const match = await matchModel.findByIdAndDelete(id);

        if (!match) {
            return response.status(404).send( {message: "Match not found" });
        }

        return response.status(200).send({message: "Match deleted"});
    } catch (error) {
        console.log(error);
        response.status(500).send({message: error.message});
    }
})

//Delete all matches (danger)
router.delete("/", async (request, response) => {
    try {
        await matchModel.deleteMany({});

        return response.status(200).send( {message: `You deleted all matches!`} ); 

    } catch (error) {
        console.log(error);
        return response.status(500).send( {message: error.message} );
    }
});

export default router;