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

router.get("/search", isAuthenticated, async (request, response) => {
    try {
        const user = await User.findById(request.session.userId);

        let randomSkill = [];

        while (randomSkill.length == 0) {
            const randomFocus = user.selectFocusWeighted();
            console.log(randomFocus);

            randomSkill = await Skill.aggregate([
                { $match : { focus: randomFocus } },
                { $match : { user: { $ne: request.session.userId } } },
                { $limit: 1 }
            ]);
        }

        randomSkill = randomSkill[0];

        randomSkill = await Skill.populate(randomSkill, { path: "user" });

        return response.status(200).send({ skill: randomSkill });
    } catch (error) {
        console.log(error);
        return response.status(500).send({ message: error.message });
    }
})

router.post("/dislike", isAuthenticated, async (request, response) => {
    try {
        const skill = await Skill.findById(request.body.skill);
        const user = await User.findById(request.session.userId);

        user = user.updateDisliked(skill.focus);

        return response.status(200).send({ user });
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: error.message });
    }
})

router.post("/like", isAuthenticated, async (request, response) => {
    try {
        const skill = await Skill.findById(request.body.skill);
        const user = await User.findById(request.session.userId);

        user = user.updateLiked(skill.focus);

        return response.status(200).send({ user });
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: error.message });
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

router.delete("/:id", async (request, response) => {
    try {
        const { id } = request.params;

        const skill = await Skill.findByIdAndDelete(id);

        if (!skill) {
            return response.status(404);
        }

        return response.status(201);
    } catch (error) {
        console.log(error);
        return response.status(500).send({ message: error.message });
    }
})

export default router;

