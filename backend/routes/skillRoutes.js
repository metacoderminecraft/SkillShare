import { User } from "../dbModels/User.js";
import { Skill } from "../dbModels/Skill.js";
import express from "express";

const router = express.Router();

const isAuthenticated = (request, response, next) => {
    if (request.session.userId) {
        return next();
    }

    return response.status(401).send({ message: "Unauthroized from authentication" });
}

router.post("/create", isAuthenticated, async (request, response) => {
    try {
        const newSkill = {
            user: request.session.userId,
            title: request.body.title,
            description: request.body.description,
            focus: request.body.focus
        }

        const skill = await Skill.create(newSkill);

        return response.status(201).send({ skill });
    } catch (error) {
        console.log(error);
        return response.status(500).send({ message: error.message }); 
    }
})

router.delete("/delete", isAuthenticated, async (request, response) => {
    try {
        const skill = await Skill.findById(request.body.id);

        if (!skill) {
            return response.status(404).send({ message: "Skill not found" })
        }

        if (skill.user != request.session.userId) {
            return response.status(401).send({ message: "Not owner of this skill" });
        }

        await Skill.findByIdAndDelete(request.body.id);
    } catch (error) {
        console.log(error);
        return response.status(500).send({ message: error.message });
    }
})


//delete after project
router.get("/", async (request, response) => {
    try {
        const skills = await Skill.find({}).populate("user");

        return response.status(200).json({
            count: skills.length,
            data: skills
        });
    } catch (error) {
        console.log(error);
        return response.status(500).send({ message: error.message });
    }
})

export default router;

