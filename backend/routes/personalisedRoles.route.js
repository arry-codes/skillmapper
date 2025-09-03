import express from 'express';
import { fetchUser } from '../middlewares/fetchUser.middleware.js';
import { User } from '../models/user.model.js';
import { PersonalizedRoadmap } from '../models/personalizedRoadmap.model.js';
import { UserRoadmapSchema } from '../utils/zodSchema.js';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { PersonalizedProgress } from '../models/personalisedProgress.model.js';


const router = express.Router();

router.get('/get-roadmap', fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const userRoadmap = await PersonalizedRoadmap.findById(userId).lean();

    if (userRoadmap) {
      const { userId: _uid, _id, __v, ...clientData } = userRoadmap;
      console.log("Already exists")
      return res.status(200).json(clientData);
    }

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
      temperature: 0.5,
      apiKey: process.env.GEMINI_API_KEY,
    });

    const structuredModel = model.withStructuredOutput(UserRoadmapSchema);

   const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an expert career mentor generating structured and actionable learning roadmaps. The user is an Indian student aiming to learn new skills for a specific tech role. Your output must be relevant, practical, and locally suited for Indian learners.`
  ],
  [
    "user",
    `Create a personalized learning roadmap for someone who has the following skills: {skills}, and wants to become a {role}.

1. Break the roadmap into clear **phases or weeks** with learning goals.
2. For **difficult or abstract topics**, add **YouTube video links** 
3. Follow an **80:20 ratio** — 80% Indian content, 20% global if needed.
4. Make sure all links are **currently working YouTube URLs** — avoid broken or placeholder links.
5. Include links to courses or documentation also if needed.
`
  ]
]);


    const chain = prompt.pipe(structuredModel);

    const rawResult = await chain.invoke({
      skills: user.skills,
      role: user.goal,
    });

    const transformedSteps = rawResult.personalisedSteps.map((step) => ({
      ...step,
      topicNames: step.topicNames.map((name, index) => ({
        id: index + 1,
        name,
      })),
    }));

    const transformedCapstone = {
      ...rawResult.capstoneProject,
      topicNames: rawResult.capstoneProject.topicNames.map((name, i) => ({
        id: i + 1,
        name,
      })),
      resources: rawResult.capstoneProject.resources.map((res) => ({
        type: res.type || "documentation",
        ...res,
      })),
    };

    const finalResult = {
      ...rawResult,
      personalisedSteps: transformedSteps,
      capstoneProject: transformedCapstone,
    };

    // Optional: save in DB
    await PersonalizedRoadmap.findByIdAndUpdate(
      userId,
      { ...finalResult, userId: userId },
      { upsert: true }
    );

    const { userId: _, ...safeClientData } = finalResult;
    return res.status(200).json(safeClientData);


  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

router.patch('/progress/updateTopic', fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { topicId, phaseId, action } = req.body
    if (
      topicId === undefined ||
      phaseId === undefined ||
      !["add", "remove"].includes(action)
    ) {
      return res.status(400).send("Invalid Patch Request");
    }

    let updateTopic;
    if (action == "add") {
      updateTopic = {
        $addToSet: {
          completedTopics: {
            phaseId,
            topicId
          }
        }
      }
    }
    else {
      updateTopic = {
        $pull: {
          completedTopics: {
            phaseId,
            topicId
          }
        }
      }
    }

    const updateProgress = await PersonalizedProgress.findOneAndUpdate({ userId },
      updateTopic,
      { new: true, upsert: true }
    )
    return res.status(200).json(updateProgress);

  }
  catch (error) {
  console.error("UpdateTopic Error:", error); // 👈 Add this
  return res.status(500).json({ error: error.message });
}
})

router.patch('/progress/updateProject', fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { topicId, action } = req.body
    if (!topicId || !action) {
      return res.status(400).send("Invalid Patch Request")
    }
    let updateProject;
    if (action == "add") {
      updateProject = {
        $addToSet: {
          completedCapstoneTopics: {
            topicId
          }
        }
      }
    }
    else {
      updateProject = {
        $pull: {
          completedCapstoneTopics: {
            topicId,
          }
        }
      }
    }

    const updateProgress = await PersonalizedProgress.findOneAndUpdate({ userId },
      updateProject,
      { new: true, upsert: true }
    )
    return res.status(200).json(updateProgress);

  }
  catch (error) {
    console.log("Error in updating Completed Project Topic ", error.message)
    return res.status(500).json({ error: error.message });
  }
})

router.get('/progress', fetchUser, async (req, res) => {
  try {
    const user = req.user.id;
    const progress = await PersonalizedProgress.findOne({ userId: user });
    
    if (!progress) {
      return res.status(200).json({ 
        completedTopics: [], 
        completedProjects: [] 
      });
    }
    
    return res.status(200).json({
      completedTopics: progress.completedTopics || [],
      completedProjects: progress.completedCapstoneTopics || []
    });
  } catch (error) {
    console.log('Error in fetching progress', error.message);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
