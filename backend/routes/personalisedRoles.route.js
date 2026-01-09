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
      model: "gemini-flash-latest",
      temperature: 0.5,
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an expert career mentor. Generate a structured learning roadmap in strict JSON format.
    The response must be a valid JSON object matching this structure exactly, with no markdown code blocks:
    {{
      "title": "string",
      "description": "string",
      "role": "string",
      "salary": "string (Range in Indian Rupees)",
      "currentSkills": ["string"],
      "growth": "string",
      "personalisedSteps": [
        {{
          "title": "string",
          "description": "string (optional)",
          "estimatedTime": "string",
          "difficulty": "string",
          "requiredSkills": ["string"],
          "topicNames": ["string"],
          "resources": [
            {{ "name": "string", "link": "string (valid URL)", "type": "string (optional)" }}
          ]
        }}
      ],
      "capstoneProject": {{
        "title": "string",
        "description": "string",
        "estimatedTime": "string",
        "skillsUsed": ["string"],
        "topicNames": ["string"],
        "resources": [
           {{ "name": "string", "link": "string", "type": "string (optional)" }}
        ]
      }}
    }}
    `
      ],
      [
        "user",
        `Create a personalized learning roadmap for someone who has the following skills: {skills}, and wants to become a {role}.
1. Break the roadmap into clear phases/weeks.
2. Follow 80:20 Indian/Global content ratio.
3. Use valid YouTube links.
4. IMPORTANT: Return ONLY pure JSON. Do not wrap in \`\`\`json or \`\`\`.
`
      ]
    ]);


    const chain = prompt.pipe(model);

    const result = await chain.invoke({
      skills: user.skills,
      role: user.goal,
    });

    // Manually parse the content
    let rawText = result.content;
    // Cleanup simple markdown if present
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    let rawResult;
    try {
      rawResult = JSON.parse(rawText);
    } catch (e) {
      console.error("JSON Parsing failed on:", rawText);
      throw new Error("Failed to generate valid JSON roadmap");
    }

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
