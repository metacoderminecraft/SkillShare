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

        const newBook = {
            user1: request.body.user1,
            user2: request.body.user2,
            date: request.body.date
        }

        const book = await matchModel.create(newBook);

        response.status(200).send(book);
    } catch (error) {
        console.log(error);
        response.status(500).send({message: error.message});
    }
})

router.get("/", async (request, response) => {
    try {
        const books = await matchModel.find({});

        return response.status(200).send({
            count: books.length,
            data: books
        })
    } catch (error) {
        console.log(error);
        return response.status(500).send({message: error.message});
    }
})

router.get("/:id", async (request, response) => {
    try {
        const { id } = request.params;

        const book = await matchModel.findById(id);

        if (!book) {
            return response.status(404).send( {message: "Book Not Found"} );
        }

        return response.status(200).json(book);
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

        const newBook = {
            user1: request.body.user1,
            user2: request.body.user2,
            date: request.body.date
        }

        const book = await matchModel.findByIdAndUpdate(id, newBook);

        if (!book) {
            return response.status(404).send({ message: "Book not found" });
        }

        return response.status(200).send( {message: "Book Updated!" });        
    } catch (error) {
        console.log(error);
        response.status(500).send({message: error.message});
    }
})

router.delete("/:id", async (request, response) => {
    try {
        const { id } = request.params;

        const book = await matchModel.findByIdAndDelete(id);

        if (!book) {
            return response.status(404).send( {message: "Book not found" });
        }

        return response.status(200).send({message: "Book deleted"});
    } catch (error) {
        console.log(error);
        response.status(500).send({message: error.message});
    }
})

//Delete all books (danger)
router.delete("/", async (request, response) => {
    try {
        await matchModel.deleteMany();

        return response.status(200).send( {message: `You deleted all books!`} ); 

    } catch (error) {
        console.log(error);
        return response.status(500).send( {message: error.message} );
    }
});

export default router;