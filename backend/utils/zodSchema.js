import { z } from "zod";

export const UserRoadmapSchema = z.object({
  title: z.string(),
  description: z.string(),
  role: z.string(),
  salary: z.string().describe("Only Range of salary in Indian Rupees"),
  currentSkills: z.array(z.string()),
  growth: z.string(),
  personalisedSteps: z.array(
    z.object({
      title: z.string(),
      description: z.string().optional(),
      estimatedTime: z.string(),
      difficulty: z.string(),
      requiredSkills: z.array(z.string()),
      topicNames: z.array(z.string()),
      resources: z.array(
        z.object({
          name: z.string(),
          type: z.string().optional(),
          link: z.string(),
        })
      ),
    })
  ),
  capstoneProject: z.object({
    title: z.string(),
    description: z.string(),
    estimatedTime: z.string(),
    skillsUsed: z.array(z.string()),
    topicNames: z.array(z.string()),
    resources: z.array(
      z.object({
        name: z.string(),
        link: z.string(),
        type: z.string().optional(),
      })
    ),
  }),
});
